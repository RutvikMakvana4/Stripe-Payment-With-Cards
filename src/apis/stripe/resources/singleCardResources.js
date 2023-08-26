import { baseUrl } from "../../../common/constants/configConstants"

export default class SingleCardResource {
    constructor(card) {
        return ({
            _id: card._id,
            last4: card.lastNumber,
            exp_month: card.expMonth,
            exp_year: card.expYear,
            card_type: card.brand,
            isDefault: card.isDefault,
            icon: baseUrl('cards/' + card.brand + '.png'),
        })
    }
}