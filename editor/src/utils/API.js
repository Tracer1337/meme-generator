function url(path) {
    return `${window.location.protocol}//${window.location.hostname}:8080/api${path}`
}

export const uploadTemplate = (formData) => fetch(url("/template"), {
    method: "POST",
    body: formData
})

export const getTemplates = () => {
    return fetch(url("/templates"))
        .then(res => res.json())
        .then(data => {
            data.forEach(template => {
                if (template.meta_data) {
                    template.meta_data = JSON.parse(template.meta_data)
                }
            })
            return data
        })
}

export const authorize = (password) => fetch(url("/authorize"), {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
}).then(res => res.json())