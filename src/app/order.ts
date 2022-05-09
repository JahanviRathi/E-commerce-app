export interface Order {
    datePlaced: Date,
    shipping : {Name : string , Address: string, City: string},
    items: {Product , quantity: number, price: number}
}
