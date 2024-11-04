<script setup>
const registrationEmail = defineModel('registrationEmail')
registrationEmail.value = "johndoe@gmail.com"

const register = async () => {
    const data = {
        email: registrationEmail.value
    }
    try {
        const resp = await fetch('/api/v1/tokens/verification/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!resp.ok) {
            throw new Error(`Response status: ${resp.status}`)
        }

        const json = await resp.json()
        console.log(json)
    } catch (error) {
        console.error(error.message)
    }
}
</script>

<template>
    <form @submit.prevent="register">
        <label for="registration-email">Email</label>
        <input id="registration-email" type="email" v-model="registrationEmail" />
    </form>
</template>

<style scoped>
</style>
