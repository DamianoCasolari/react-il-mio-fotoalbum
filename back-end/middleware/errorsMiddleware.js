// module.exports = function (err,req,res,next){
//     console.log(err);
//     return res.status(err.status ?? 500).send("Errore sistema : " + err.message)
// }

module.exports = function (err, req, res, next) {
    console.log(err);
    return res.status(err.status ?? 500).json({
        error: "Errore sistema: " + err.message
    });
};
