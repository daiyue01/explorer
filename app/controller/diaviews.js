/**
 * 
 */
const viewer = appload('viewer')



module.exports = function(req, res)
{
    viewer.render('diaviews', {
        show_fee: !(req.query.no_fee),
    }, req, res)
}
