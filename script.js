const balanceEl = document.getElementById("balance")
const incomeEl = document.getElementById("income")
const expenseEl = document.getElementById("expense")

const form = document.getElementById("form")
const titleEl = document.getElementById("title")
const amountEl = document.getElementById("amount")
const typeEl = document.getElementById("type")
const dateEl = document.getElementById("date")
const error_message = document.getElementById("error-message")

const type_filter = document.getElementById("type-filter")

const transactions_listEl = document.querySelector(".transactions-list")

form.addEventListener("submit",(event)=>{
    event.preventDefault()
    data = get_transactions()
    newdata = create_transaction(data)
    set_transactions(newdata)
    renderUI(newdata)
})

function add_errormessage(text){
    error_message.classList.remove("not-show")
    error_message.textContent = text
}
function create_transaction(transactions){
    const title = titleEl.value.trim()
    const amount = amountEl.value.trim()
    const type = typeEl.value.trim()
    const date = dateEl.value.trim()

    if(title == ""){
        add_errormessage("Invalid Title")
        return
    }
    if(amount <= 0 || amount == ""){
        add_errormessage("Invalid Amount")
        return
    }
    if(date == ""){
        add_errormessage("Invalid Date")
        return
    }

    error_message.classList.add("not-show")
    const transaction = {
        id:Date.now(),
        title:title,
        amount:amount,
        type:type,
        date:date
    }

    transactions.push(transaction)
    return transactions
}

function renderUI(data){
    transactions_listEl.innerHTML = "<h1>Transactions</h1>"
    data.forEach((transaction)=>{
        transactionEl = document.createElement("div")
        if(transaction.type == "income"){
            transactionEl.classList.add("transaction","income")
        }
        else{
             transactionEl.classList.add("transaction","expense")
        }
        transactionEl.innerHTML = `
                <div>
                    <h3>${transaction.title}</h3>
                    <h3>${transaction.date}</h3>
                </div>

                <div><h3>${transaction.type == "income"? "Income":"Expense"}</h3></div>

                <div>
                    <h3>${transaction.amount}</h3>
                    <div>
                        <button class="edit">Edit</button>
                        <button class="del">Del</button>
                    </div>
                </div>`
        const edit_btn = transactionEl.querySelector(".edit")
        const del_btn = transactionEl.querySelector(".del")
        del_btn.addEventListener("click",()=>{
            data = get_transactions()
            newdata = delete_transaction(transaction.id,data)
            set_transactions(newdata)
            renderUI(newdata)
        })

        transactions_listEl.appendChild(transactionEl)
    })
}

function delete_transaction(id,data){
    data = data.filter((item)=>item.id != id)
    return data

}

function get_transactions(){
    rawdata = localStorage.getItem("transactions")
    if (!rawdata) return []
    data = JSON.parse(rawdata)
    return data
}

function set_transactions(data){
    localStorage.setItem("transactions",JSON.stringify(data))
    return
}