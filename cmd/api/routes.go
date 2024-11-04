package main

import (
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/micahco/api/ui"
)

// App router
func (app *application) routes() http.Handler {
	r := chi.NewRouter()

	r.Route("/api", func(r chi.Router) {
		// Middleware
		r.Use(middleware.StripSlashes)
		r.Use(app.metrics)
		r.Use(app.recovery)
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

	r.Handle("/*", app.spaHandler())

	return r
}

func (app *application) spaHandler() http.HandlerFunc {
	fsys, err := fs.Sub(ui.Files, "frontend")
	if err != nil {
		panic(fmt.Errorf("failed getting the sub tree for the site files: %w", err))
	}
	return func(w http.ResponseWriter, r *http.Request) {
		f, err := fsys.Open(strings.TrimPrefix(path.Clean(r.URL.Path), "/"))
		if err == nil {
			defer f.Close()
		}
		if os.IsNotExist(err) {
			r.URL.Path = "/"
		}
		http.FileServer(http.FS(fsys)).ServeHTTP(w, r)
	}
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
