import stripeServices from "./stripeServices";
import CardsResource from "./resources/stripeCardsResources";
import SingleCardResource from "./resources/singleCardResources";

class stripeController {
    /**
     * @description: Create card in stripe
     * @param {*} req 
     * @param {*} res 
     */
    static async createCard(req, res) {
  
        const data = await stripeServices.createCard(req.user, req.body, req, res);
       
        return res.send({ message: "Card added successfully", data: new SingleCardResource(data) });
    }


    /**
     * @description: all card list
     * @param {*} req 
     * @param {*} res 
     */
    static async cardList(req, res) {
        const data = await stripeServices.cardList(req.user, req.body, req, res);
        return res.send({ message: "Card list", data: new SingleCardResource(data) });
    }

     /**
     * @description: Edit card info 
     * @param {*} req 
     * @param {*} res 
     */
     static async deleteCardInfo(req, res) {
        const data = await stripeServices.deleteCardInfo(req.user, req.params.id, req, res);
        return res.send({ message: "Card deleted successfully" })
    }



    /**
     * @description: Set default card select
     * @param {*} req 
     * @param {*} res 
     */
    static async setDefaultCard(req, res) {
        const data = await stripeServices.setDefaultCard(req.user, req.params.id, req, res);
        return res.send({ message: "Card selected successfully" });
    }



    /**
     * @description: Create charge for payment
     * @param {*} req 
     * @param {*} res 
     */
    static async createCharge(req, res) {
        const data = await stripeServices.createCharge(req.user, req.params.id, req, res);
        return res.send({ message: "Congrats! your payment done successfully" })
    }



    /**
     * @description: Edit card info
     * @param {*} req 
     * @param {*} res 
     */
    static async editCardInfo(req, res) {
        const data = await stripeServices.editCardInfo(req.user, req.params.id, req.body, req, res);
        return res.send({ message: "Card updated successfully", data: new SingleCardResource(data) })
    }

}

export default stripeController;