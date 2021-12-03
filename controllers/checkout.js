const Xendit = require("xendit-node")
const xendit = new Xendit({
    secretKey : process.env.API_XENDIT
})
const { Cart, sequelize , Product} = require("../../models")
const { authentication } = require("../../helpers/authentication")
const { Invoice } = xendit
const invoiceSpesificOption = {};
const invoice = new Invoice(invoiceSpesificOption)

module.exports = authentication(async (_,args, {user}) => {
    const transaction = await sequelize.transaction()
    try {
        const allUserCarts = await Cart.findAll({
            where : {
                UserId: user.id
            },
            include : ["Product"]
        })
        const errors = []
        const toBeExecute = []
        const fixQuantity = []
        let totalPrice = 0
        let externalID = ""
        allUserCarts.forEach(cart => {
            if(cart.quantity <= cart.Product.stock && cart.status != "lunas"){
                // console.log("masuk disini")
                const finalStock = cart.Product.stock - cart.quantity
                const productId = cart.Product.id
                externalID = externalID+cart.id
                totalPrice = (cart.Product.price * cart.quantity)+totalPrice
                const updateStockOfProduct = Product.update({stock : finalStock}, {
                    where : {
                        id : productId
                    },
                    returning : true,
                    transaction
                })
                const updateStatusOfCart = Cart.update({status : "lunas"}, {
                    where : {
                        id : cart.id
                    },
                    returning : true,
                    transaction
                })
                toBeExecute.push(updateStockOfProduct)
                toBeExecute.push(updateStatusOfCart)
            }
            else if (cart.status != "lunas") {
                // console.log("error disini", cart.dataValues)
                fixQuantity.push(Cart.update({quantity: cart.Product.stock}), {where: { id: cart.id }})
                errors.push(`gagal beli ${cart.Product.name}`)
            }
        });
        // console.log(totalPrice, "<<< ini totalnya");
        const result = await Promise.all(toBeExecute)
        // console.log(errors, "<<<<< ini eror");
        if(errors.length > 0) {
            await Promise.all(fixQuantity)
            throw new Error("ada yang salah")
        }
        const invoiceData = await invoice.createInvoice({
            externalID : externalID,
            description : "pembayaran dari dibuang sayang",
            payerEmail : user.email,
            amount : totalPrice ,
        })
        // console.log(invoiceData.external_id, "ini ");
        const message = {
            id : invoiceData.id,
            external_id : invoiceData.external_id,
            user_id : invoiceData.user_id,
            status : invoiceData.status,
            merchant_name : invoiceData.merchant_name,
            amount : invoiceData.amount,
            payer_email : invoiceData.payer_email,
            description : invoiceData.description,
            expiry_date : invoiceData.expiry_date,
            invoice_url : invoiceData.invoice_url,
        } 
        // console.log(message, "<<< ini message");
        await transaction.commit()
        return {msg : JSON.stringify(message)}
        
    } catch (error) {
        // console.log(error);
        await transaction.rollback()
        return error
    }
})