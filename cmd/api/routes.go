package main

import (
	"io/fs"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/micahco/api/ui"
)

// App router
func (app *application) routes() (http.Handler, error) {
	r := chi.NewRouter()

	r.Route("/api", func(r chi.Router) {
		// Middleware
		r.Use(middleware.StripSlashes)
		r.Use(app.metrics)
		r.Use(app.recovery)
		r.Use(app.enableCORS)
		r.Use(app.rateLimit)
		r.Use(app.authenticate)

		// Metrics
		r.Mount("/debug", middleware.Profiler())

		// API
		r.Route("/v1", func(r chi.Router) {
			r.Get("/healthcheck", app.handle(app.healthcheck))

			r.Route("/tokens", func(r chi.Router) {
				r.Post("/authentication", app.handle(app.tokensAuthenticationPost))

				r.Route("/verification", func(r chi.Router) {
					r.Post("/registration", app.handle(app.tokensVerificaitonRegistrationPost))
					r.Post("/password-reset", app.handle(app.tokensVerificaitonPasswordResetPost))

					r.Route("/email-change", func(r chi.Router) {
						r.Use(app.requireAuthentication)

						r.Post("/", app.handle(app.tokensVerificaitonEmailChangePost))
					})
				})
			})

			r.Route("/users", func(r chi.Router) {
				r.Post("/", app.handle(app.usersPost))
				r.Put("/password", app.handle(app.usersPasswordPut))

				r.Route("/me", func(r chi.Router) {
					r.Use(app.requireAuthentication)

					r.Get("/", app.handle(app.usersMeGet))
					r.Put("/", app.handle(app.usersMePut))
				})
			})
		})
	})

	stripped, err := fs.Sub(ui.Files, "frontend")
	if err != nil {
		return nil, err
	}
	r.Handle("/*", http.FileServer(http.FS(stripped)))

	return r, nil
}

func (app *application) healthcheck(w http.ResponseWriter, r *http.Request) error {
	env := "production"
	if app.config.dev {
		env = "development"
	}

	data := envelope{
		"status": "available",
		"system_info": map[string]string{
			"environment": env,
			"version":     version,
		},
	}

	return app.writeJSON(w, http.StatusOK, data, nil)
}
