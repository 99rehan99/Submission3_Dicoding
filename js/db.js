const dbPromised = idb.open('reys-football', 1, function (upgradeDb) {
    const teamsObjectStore = upgradeDb.createObjectStore('team', {
        keyPath: 'id'
    })
    teamsObjectStore.createIndex('teamName', 'name', {
        unique: false
    })
})

function addFavoriteTeam(team) {
    dbPromised
        .then(function (db) {
            const transaction = db.transaction('team', 'readwrite')
            const store = transaction.objectStore('team')
            store.add(team)
            return transaction.complete
        }).then(function () {
            showNotificationMessage(team.name, "Tim favorite anda, berhasil ditambahkan.")
        }).catch(function (error) {
            if (error === null) showNotificationMessage(team.name, "Tim ini sudah ada didatabase :).")
            else console.log(error)
        })
}

function getAllTeams() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                const transaction = db.transaction('team', 'readwrite')
                const store = transaction.objectStore('team')
                return store.getAll()
            })
            .then(function (teams) {
                resolve(teams)
            })
    })
}

function deleteTeam(squad) {
    dbPromised
        .then(function (db) {
            const transaction = db.transaction('team', 'readwrite')
            let store = transaction.objectStore('team')
            store.delete(parseInt(squad.id))
            return transaction.complete
        }).then(function () {
            showNotificationMessage(squad.title, 'Tim berhasil dihapus dari daftar tim favorite anda.')
            location.reload();
        })
}