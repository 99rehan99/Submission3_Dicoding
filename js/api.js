const base_url = 'https://api.football-data.org/v2/'
const api_token = '031cb13ff0274b41bf48afd7b3513c90'

// Untuk membuat 
const fetchApi = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': api_token
        }
    })
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log('Error : ' + response.status)
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText))
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa 'di-then-kan'
        return Promise.resolve(response)
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json()
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log('Error : ' + error)
}

// Untuk menampilkan klasemen liga spanyol dengan mengunakan fetchApi
function getStandings() {
    const last5 = str => {
        let html = ``,
            type = ''
        const data = str.split(',')

        data.forEach(form => {
            type = form === 'W' ? './assets/won.svg' : form === 'D' ? './assets/draw.svg' : './assets/lost.svg'
            html += `<img class='last-5' src='${type}'>`
        })

        for (let i = 0; i < 5 - data.length; i++) html += `<img class='last-5' src='./assets/none.svg'>`

        return html
    }

    if ('caches' in window) {
        caches.match(`${base_url}competitions/2014/standings`).then(function (response) {
            if (response) {
                response.json().then(function (data) {

                    let standingsHTML = ''
                    data.standings[0].table.forEach(standing => {
                        standingsHTML += `
                            <tr>
                                <td>${standing.position}<img src='${standing.team.crestUrl}'>${standing.team.name}</td>
                                <td class='center-align'>${standing.playedGames}</td>
                                <td class='center-align'>${standing.won}</td>
                                <td class='center-align'>${standing.draw}</td>
                                <td class='center-align'>${standing.lost}</td>
                                <td class='center-align'>${standing.goalsFor}</td>
                                <td class='center-align'>${standing.goalsAgainst}</td>
                                <td class='center-align'>${standing.goalDifference}</td>
                                <td class='center-align'>${standing.points}</td>
                                <td class='center-align'>${last5(standing.form)}</td>
                            </tr>
                        `
                    })
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById('season').innerHTML = `${data.season.startDate.substr(0, 4)}-${data.season.endDate.substr(2, 2)}`
                    document.getElementById('t-body').innerHTML = standingsHTML
                })
            }
        })
    }

    fetchApi(`${base_url}competitions/2014/standings`)
        .then(status)
        .then(json)
        .then(function (data) {
            document.getElementById('season').innerHTML = `${data.season.startDate.substr(0, 4)}-${data.season.endDate.substr(2, 2)}`
            // Objek/array JavaScript dari response.json() masuk lewat data.

            // Menyusun komponen card artikel secara dinamis
            let standingsHTML = ''
            data.standings[0].table.forEach(standing => {
                standingsHTML += `
                <tr>
                    <td>${standing.position}<img src='${standing.team.crestUrl}'>${standing.team.name}</td>
                    <td class='center-align'>${standing.playedGames}</td>
                    <td class='center-align'>${standing.won}</td>
                    <td class='center-align'>${standing.draw}</td>
                    <td class='center-align'>${standing.lost}</td>
                    <td class='center-align'>${standing.goalsFor}</td>
                    <td class='center-align'>${standing.goalsAgainst}</td>
                    <td class='center-align'>${standing.goalDifference}</td>
                    <td class='center-align'>${standing.points}</td>
                    <td class='center-align'>${last5(standing.form)}</td>
                </tr>
            `
            })
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById('t-body').innerHTML = standingsHTML
        })
        .catch(error)
}

// Untuk mengambil dan menampilkan tim liga spanyol dengan mengunakan fetchApi
function getTeams() {
    const row = `<div class='row'>`,
        col = `<div class='col s12 m6 l6'>`,
        div = `</div>`

    if ('caches' in window) {
        caches.match(`${base_url}competitions/2014/teams`).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    let teamsHTML = `${row}`,
                        count = 0

                    data.teams.forEach(team => {
                        if (count === 2) {
                            teamsHTML += div
                            teamsHTML += row
                        }

                        teamsHTML += `
                        ${col}
                            <div class='card'>
                                <a href='./team.html?id=${team.id}'>
                                    <div class='card-image'>
                                        <img class='activator emblem' src='${team.crestUrl}'>
                                        <a class='btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons save' id='${team.id}'>add</i></a>
                                    </div>
                                </a>
                                <div class='card-content'>
                                    <span class='card-title title' style='color:#FBF7F0;text-align:left'>${team.name}</span>
                                    <p class='left-align'><b>Short Name</b> : ${team.shortName}</p>
                                    <p class='left-align'><b>Venue</b>      : ${team.venue}</p>
                                    <p class='left-align'><b>Website</b>    : <a href='${team.website}' target='_blank'>Go to website</a></p>
                                </div>
                            </div>
                        ${div}
                        `

                        if (count === 2) count = 0
                            ++count
                    })

                    teamsHTML += div
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById('body-content-teams').innerHTML = teamsHTML

                    let elements = document.getElementsByClassName('save')

                    for (let i = 0; i < elements.length; i++) {
                        elements[i].onclick = function () {
                            const item = favTeam(elements[i])
                            item.then(function (team) {
                                addFavoriteTeam(team)
                            })
                        }
                    }
                })
            }
        })
    }

    fetchApi(`${base_url}competitions/2014/teams`)
        .then(status)
        .then(json)
        .then(function (data) {
            // Menyusun komponen card artikel secara dinamis
            let teamsHTML = `${row}`,
                count = 0

            data.teams.forEach(team => {
                if (count === 2) {
                    teamsHTML += div
                    teamsHTML += row
                }

                teamsHTML += `
                    ${col}
                        <div class='card'>
                            <a href='./team.html?id=${team.id}'>
                                <div class='card-image'>
                                    <img class='activator emblem' src='${team.crestUrl}'>
                                    <a class='btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons save' id='${team.id}'>add</i></a>
                                </div>
                            </a>
                            <div class='card-content'>
                                <span class='card-title title' style='color:#FBF7F0;text-align:left'>${team.name}</span>
                                <p class='left-align'><b>Short Name</b> : ${team.shortName}</p>
                                <p class='left-align'><b>Venue</b>      : ${team.venue}</p>
                                <p class='left-align'><b>Website</b>    : <a href='${team.website}' target='_blank'>Go to Website</a></p>
                            </div>
                        </div>
                    ${div}
                `
                if (count === 2) count = 0
                    ++count
            })

            teamsHTML += div
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById('body-content-teams').innerHTML = teamsHTML

            let elements = document.getElementsByClassName('save')

            for (let i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    let item = favTeam(elements[i])
                    item.then(function (team) {
                        addFavoriteTeam(team)
                    })
                }
            }
        })
        .catch(error)
}

// Mengambilkan data squad tim sesuai dengan yang pengguna pilih
function favTeam(element) {
    return new Promise(function (resolve, reject) {
        fetchApi(`${base_url}teams/${element.id}`)
            .then(status)
            .then(json)
            .then(function (data) {
                // console.log(data)
                resolve(data)
            }).catch(function (error) {
                console.log(error.statusText)
            })
    })
}

// Untuk mengambil data menampilkan tim dengan ID
function getTeamById() {
    return new Promise(function (resolve, reject) {
        // Ambil nilai query parameter (?id=)
        const urlParams = new URLSearchParams(window.location.search)
        const idParam = urlParams.get('id')
        const row = `<div class='row'>`,
            col = `<div class='col s12 m6 l3'>`,
            div = `</div>`

        if ('caches' in window) {
            caches.match(`${base_url}teams/${idParam}`).then(function (response) {
                    if (response) {
                        response.json().then(function (data) {
                            let teamHTML = `<h1 class='title'>${data.name}</h1>`,
                                count = 0

                            teamHTML += `${row}`
                            data.squad.forEach(team => {

                                if (count === 4) {
                                    teamHTML += div
                                    teamHTML += row
                                }

                                teamHTML += `
                                    ${col}
                                        <div class='special-card card blue-grey darken-1'>
                                            <div class='card-content white-text'>
                                                <p style='margin-bottom:10px'><b>${team.name}</b></p>
                                                <p>${(team.position === null ? team.role : team.position).replace('_', ' ').toLowerCase()}</p>
                                                <p>${team.nationality}</p>
                                            </div>
                                        </div>
                                    ${div}
                               `
                                if (count === 4) count = 0
                                    ++count
                            })
                            teamHTML += div
                            document.getElementById('squad').innerHTML = teamHTML
                            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                            resolve(data)
                        })
                    }
                })
                .catch(function (message) {
                    console.log(message)
                })
        }
        fetchApi(`${base_url}teams/${idParam}`)
            .then(status)
            .then(json)
            .then(function (data) {
                let teamHTML = `<h1 class='title'>${data.name}</h1>`,
                    count = 0

                teamHTML += `${row}`
                data.squad.forEach(team => {

                    if (count === 4) {
                        teamHTML += div
                        teamHTML += row
                    }

                    teamHTML += `
                        ${col}
                            <div class='special-card card blue-grey darken-1'>
                                <div class='card-content white-text'>
                                    <p style='margin-bottom:10px'><b>${team.name}</b></p>
                                    <p>${(team.position === null ? team.role : team.position).replace('_', ' ').toLowerCase()}</p>
                                    <p>${team.nationality}</p>
                                </div>
                            </div>
                        ${div}
                    `
                    if (count === 4) count = 0
                        ++count
                })
                teamHTML += div
                document.getElementById('squad').innerHTML = teamHTML
                // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                resolve(data)
            })
    })
}

// Untuk mengambil data menampilkan kumpulan tim favorite yg dipilih pengguna
function getFavoriteTeams() {
    const row = `<div class='row'>`,
        col = `<div class='col s12 m6 l6'>`,
        div = `</div>`

    const favTeams = getAllTeams()
    favTeams.then(function (data) {
        if (data) {

            let teamsHTML = `${row}`,
                count = 0

            data.forEach(team => {
                if (count === 2) {
                    teamsHTML += div
                    teamsHTML += row
                }

                teamsHTML += `
                        ${col}
                            <div class='card'>
                                <a href='./team.html?id=${team.id}'>
                                    <div class='card-image'>
                                        <img class='activator emblem' src='${team.crestUrl}'>
                                        <a class='btn-floating halfway-fab waves-effect waves-light red'><i class='large material-icons delete' id='${team.id}' title='${team.name}'>delete_forever</i></a>
                                    </div>
                                </a>
                                <div class='card-content'>
                                    <span class='card-title title' style='color:#FBF7F0;text-align:left'>${team.name}</span>
                                    <p class='left-align'><b>Short Name</b> : ${team.shortName}</p>
                                    <p class='left-align'><b>Venue</b>      : ${team.venue}</p>
                                    <p class='left-align'><b>Website</b>    : <a href='${team.website}' target='_blank'>Go to website</a></p>
                                </div>
                            </div>
                        ${div}
                        `

                if (count === 2) count = 0
                    ++count
            })

            teamsHTML += div
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById('body-content-favorite-teams').innerHTML = teamsHTML

            let elements = document.getElementsByClassName('delete')

            for (let i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    deleteTeam(elements[i])
                }
            }
        }
    })
}