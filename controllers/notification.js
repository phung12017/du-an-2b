

const FBAdmin = require('../contants/firebase_config');



exports.add = async (req, res) => {
    res.render('./notification/add');
}

exports.sendAll = async (req, res) => {
    const title = req.body.title
    const content = req.body.content



    const message_option = {
        topic: 'all',
        notification: {
            title: title,
            body: content,
        },
        data: {
            title:title,
            content:content
        }

    }



    FBAdmin.admin.messaging().send(message_option).then(r => {
        res.json({
            result: true,
            message: 'result ok movie',

            send: 'ok',
            dataSend: message_option
        });
    }).catch(e => {
        res.json({
            err: e
        })
    })
}

exports.sendToDevice = async (req, res) => {
    const title = req.body.title
    const content = req.body.content




    // const message_option = {
    //     token:'ebsUYBOpRhKtbMIrntp0ev:APA91bHN69t9crAWN1nu4fOsmV2-Qc7tYtwoSNrmVmltKA90mIVcaWzOUZBtm86bya4LrBrma3CkLyeSKqh8TYkEBYLLCa-TpglD4vxcokOj-zXOG6jUKQsJO6f_r3e2BFDccbwzMmMy',
    //     notification: {
    //         title: title,
    //         body: content,
    //      },
    //     data: {
    //          'xxx':'xxx'
    //     }

    // }


    // FBAdmin.admin.messaging().send(message_option).then(r => {
    //     res.json({
    //         result: true,
    //         message: 'result ok movie',

    //         send: 'ok',
    //         dataSend: message_option
    //     });
    // }).catch(e => {
    //     res.json({
    //         result: false,
    //         message: 'ok',
    //         movie: movie_new,
    //         send: 'fail ' + e,
    //         dataSend: []
    //     })
    // })
}