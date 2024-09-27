import { menuArray } from './data.js'

const menuItems = document.getElementById('menu-items')
const checkoutOrder = document.getElementById('checkout-order')
const modal = document.getElementById('modal')
const paymentForm = document.getElementById('payment-form')
const modalCloseBtn = document.getElementById('modal-close-btn')

let itemArrays = Array.from({ length: menuArray.length }, () => [])

paymentForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formatData = new FormData(paymentForm)
    const name = formatData.get('name')
    menuItems.innerHTML = `<div class = 'end-message'>
                                <h2>Thanks, ${name}! Your order is on its way!<h2>
                           </div>`
    modal.style.display = 'none'
    checkoutOrder.innerHTML = ''
    console.log(itemArrays)
})

modalCloseBtn.addEventListener('click', ()=>{
    modal.style.display = 'none'
})

function renderMenuItems(items){
    return items.map(item => {
        const { name, ingredients, id, price, emoji } = item
        return `<div class="menu-item">
                    <div class="item">
                        ${emoji}
                    </div>
                    <div class="item-description">
                        <h3 class="item-name">${name}</h3>
                        <p class="item-ingredients">${ingredients}</p>
                        <p class="item-price">$${price}</p>
                    </div>
                    <div class="add-item">
                        <button class = "add-button" id='${id}' name = 'menu-items'>+</button>
                    </div>
                </div>`
    }).join('')
}

menuItems.innerHTML = renderMenuItems(menuArray)

function renderCheckout(itemsArray){
    let totalPrice = itemArrays.reduce( (sum, items) => {
        if(items.length > 0){
            const lastItem = items[items.length-1]
            sum +=  lastItem[1]
        }
        return sum
    }, 0)
    let renderText = ""
    if(itemArrays.join('') === ""){
        renderText = ""
    }
    else{
        renderText = "<div class='checkout-title'><h2>Your order</h2></div>"
        itemsArray.map( (items, index) => {
            if(items.length > 0){
                renderText += `<div class='checkout-items'>
                                    <h2>${items[items.length-1][0]}</h2> 
                                    <h4>x${items.length}</h4> 
                                    <button class ='item-remove-btn' id='${index}'>remove</button>
                                    <h2 class='item-checkout-price'>$${items[items.length-1][1]}</h2>
                                </div>`
                                
            }
        })
        renderText += `<div class='checkout-items-total'>
                            <h2>Total Price:</h2><h2 class = 'total-price'>$${totalPrice}</h2>
                        </div>
                        <button class='complete-processing'>Complete Order</button>`

    }

    checkoutOrder.innerHTML = renderText

    const removeBtns = document.querySelectorAll('.item-remove-btn')
    removeBtn(removeBtns)

    const checkOutBtn = document.querySelector('.complete-processing')
    checkOutBtn.addEventListener('click', ()=>{
        modal.style.display = 'flex'
    })
}

function removeBtn(removeBtns){
    removeBtns.forEach( removeBtn => {
        removeBtn.addEventListener('click', event=>{
            const id = Number(event.target.id)
            itemArrays[id].pop()
            renderCheckout(itemArrays)
        })
    })
}

const addButtons = document.querySelectorAll('.add-button') 
addButtons.forEach( addButton => {
    addButton.addEventListener('click', event => {
        const id = Number(event.target.id)
        menuArray.filter( item => {
            if(id === item.id) {
                if(itemArrays[id].length === 0){
                    itemArrays[id].push([item.name, (item.price)*1])
                }
                else{
                    itemArrays[id].push([item.name, (item.price)*(itemArrays[id].length + 1)])
                } 
                renderCheckout(itemArrays)
            }
        })
    })
})