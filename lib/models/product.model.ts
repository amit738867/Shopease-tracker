import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    url:{ type:String, required: true, unique:true },
    title:{ type:String, required: true},
    currentPrice:{ type:Number, required: true },
    originalPrice:{ type:Number, required: true },
    discount:{ type:String},
    imgURL:{ type:String, required: true },
    lowestPrice:{ type:Number },
    highestPrice:{ type:Number },
    averagePrice:{ type:Number },
    priceHistory:[ {
        price: {type: Number, required:true},
        date: {type: Date, default: Date.now}
        }, 
    ],
    users:[
        {email : {type: String, required: true}}
    ], dafault: [],
}, {timestamps: true}
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;