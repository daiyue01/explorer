/**
 * 
 */
const viewer = appload('viewer')



module.exports = function(req, res)
{
    viewer.render('diaviews', {}, req, res)
}
