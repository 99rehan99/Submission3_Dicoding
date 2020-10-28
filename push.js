const webPush = require('web-push')

const vapidKeys = {
   'publicKey': 'BMuyI1MliochsbEV2Eo2MmLyU3OfYQNYrNtm3vYI32PT_FI5HbMz1DIDgsSRqP0v6eKH48SEmIbOP6xAbWKdN4o',
   'privateKey': 'CKFg9XqAOLCYQ96QsMtPAmwjpd-snbviNTfHVP_qDrc'
}


webPush.setVapidDetails(
   'mailto:raihansuryanom@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
const pushSubscription = {
   'endpoint': 'https://fcm.googleapis.com/fcm/send/fKyYgGx6ulc:APA91bEej8oMpKVmxGZBPpRZw_akLvKz5egu5KXXjN7L8E8Wolx-BFXop9N2nJ9MV2h-pKK9eTw-3goBbe36yrGDEG9y5_F4Lult0NPH3iZUkwIJ2RK3TgbiKeLfpIMTBp-6Ta4OVS72',
   'keys': {
      'p256dh': 'BPF3dhXTpEPJ2+MTpmk4hNlXR8WNsVsf7iBT65CZhJLPv0mXGwooAeNeUyEIs55Sa/4Z8o8IdCs4jJFe2D7AaiE=',
      'auth': 'lBU24kA5Ceed1E1lhiBKXA=='
   }
}
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!'

const options = {
   gcmAPIKey: '366516602170',
   TTL: 60
}
webPush.sendNotification(
   pushSubscription,
   payload,
   options
)