import Customer from "../../../model/stripeCustomer";
import Card from "../../../model/stripeCards";
import commonService from "../../../utils/commonService";
import Stripe from "stripe";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class stripeServices {
    /**
     * @description: Add from stripe
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async createCard(auth, data, req, res) {
        const { fullName, cardNumber, cvc, expMonth, expYear } = data;
        // console.log("request body", data)
        try {
            const customerFind = await commonService.findOne(Customer, { employeeId: auth })
            // console.log("customerfind", customerFind)

            const cardToken = await stripe.tokens.create({
                card: {
                    name: fullName,
                    number: cardNumber,
                    cvc: cvc,
                    exp_month: expMonth,
                    exp_year: expYear,
                }
            })
            // console.log("cardToken", cardToken)
            const cardCreate = await stripe.customers.createSource(customerFind.customerId, {
                source: cardToken.id
            })
            // console.log("cardCreate", cardCreate)

            const storeCard = await commonService.createOne(Card, {
                parentId: auth,
                customerId: customerFind.customerId,
                cardId: cardCreate.id,
                fullName: fullName,
                lastNumber: cardCreate.last4,
                expMonth: cardCreate.exp_month,
                expYear: cardCreate.exp_year,
                brand: cardCreate.brand,
            });

            return storeCard;

        } catch (error) {
            console.log("error", error)
        }
    }



    /**
     * @description: card lists
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async cardList(req, res) {
        const allCardList = await commonService.findAllRecords(Card, { parentId: auth })
        return allCardList;
    }



    /**
     * @description: Set default card
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async setDefaultCard(id, req, res) {
        try {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const findCardId = await commonService.findById(Card, { _id: id });
                if (findCardId) {

                    await stripe.customers.update(findCardId.customerId, {
                        default_source: findCardId.cardId,
                    });

                    const customerCardRetrive = await stripe.customers.retrieve(findCardId.customerId);
                    const stripeCardIdFind = await commonService.findOne(Card, { cardId: customerCardRetrive.default_source });

                    await Card.updateMany({ parentId: auth }, { isDefault: false });

                    const updateDefaultCard = await commonService.updateById(Card, stripeCardIdFind._id, {
                        isDefault: true
                    });

                } else {
                    throw new NotFoundException("This cardId is not found");
                }
            } else {
                throw new BadRequestException("Please provide correct id");
            }
        } catch (err) {
            console.log(err)
        }
    }


    /**
     * @description : Delete Card and their informations 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteCardInfo(req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findCardId = await commonService.findById(Card, { _id: id });

            if (findCardId) {
                const deleteCard = await stripe.customers.deleteSource(findCardId.customerId, findCardId.cardId);
                await commonService.deleteById(Card, findCardId._id);
                return true;
            } else {
                throw new NotFoundException("This cardId is not found")
            }

        } else {
            throw new BadRequestException("Please provide correct id")
        }
    }

    /**
     * @description : Edit information of Card
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */


    static async editCardInfo(req, res) {
        const { fullName, cardNumber, cvc, expMonth, expYear } = data;

        try {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const findCardId = await commonService.findById(Card, { _id: id });

                if (findCardId) {
                    const cardToken = await stripe.tokens.create({
                        card: {
                            name: fullName,
                            number: cardNumber,
                            cvc: cvc,
                            exp_month: expMonth,
                            exp_year: expYear,
                        }
                    });

                    const cardCreate = await stripe.customers.createSource(findCardId.customerId, {
                        source: cardToken.id
                    })

                    const updateCard = await commonService.createOne(Card, {
                        parentId: auth,
                        customerId: findCardId.customerId,
                        cardId: cardCreate.id,
                        fullName: cardCreate.name,
                        lastNumber: cardCreate.last4,
                        expMonth: cardCreate.exp_month,
                        expYear: cardCreate.exp_year,
                        brand: cardCreate.brand
                    });

                    if (updateCard) {
                        await stripe.customers.deleteSource(findCardId.customerId, findCardId.cardId);

                        await commonService.deleteById(Card, { _id: findCardId._id });
                        return updateCard;
                    }
                    else {
                        throw new BadRequestException('card not update')
                    }
                } else {
                    throw new NotFoundException('card not found')
                }
            }
            else {
                throw new BadRequestException("Please provide correct id")
            }
        } catch (err) {
            console.log(err)
        }
    }

}



export default stripeServices;