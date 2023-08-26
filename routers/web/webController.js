
class webController {

	/**
	 * @description: Privacy policy page
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	static async ourPolicies(req, res, next) {
		return res.render('ourPolicies', { layout: 'ourPolicies' })
	}

}
export default webController