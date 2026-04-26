const balanceEl = document.getElementById("balance")
const incomeEl = document.getElementById("income")
const expenseEl = document.getElementById("expense")

const form = document.getElementById("form")
const titleEl = document.getElementById("title")
const amountEl = document.getElementById("amount")
const typeEl = document.getElementById("type")
const dateEl = document.getElementById("date")
const error_message = document.getElementById("error-message")
const submit = document.getElementById("submit-button")

const type_filter = document.getElementById("type-filter")

const transactions_listEl = document.querySelector(".transactions-list")

let editMode = false
let editElement_id = 0

renderUI(get_transactions())
calculate_summary(get_transactions())

form.addEventListener("submit",(event)=>{
    event.preventDefault()
    data = get_transactions()
    newdata = create_transaction(data)
    if(!newdata) return
    if(editMode){
        newdata = edit_transaction(editElement_id,data,newdata)
        editMode = false
        submit.classList.remove("edit-mode")
        submit.textContent = "Add Transaction"
    }
    set_transactions(newdata)
    renderUI(newdata)
    calculate_summary(newdata)
    titleEl.value = ""
    amountEl.value = ""
    typeEl.value = "income"
    dateEl.value = ""
})

type_filter.addEventListener("change",(event)=>{
    const type = event.target.value
    filter_type(type)
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
        return false
    }
    if(amount <= 0 || amount == ""){
        add_errormessage("Invalid Amount")
        return false
    }
    if(date == ""){
        add_errormessage("Invalid Date")
        return false
    }

    error_message.classList.add("not-show")
    const transaction = {
        id:Date.now(),
        title:title,
        amount:amount,
        type:type,
        date:date
    }

    if(editMode) return transaction

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

        edit_btn.addEventListener("click",()=>{
            editMode = true
            editElement_id = transaction.id
            submit.classList.add("edit-mode")
            submit.textContent = "Edit Transaction"
            titleEl.value = transaction.title
            amountEl.value = transaction.amount
            typeEl.value = transaction.type
            dateEl.value = transaction.date

        })
        const del_btn = transactionEl.querySelector(".del")

        del_btn.addEventListener("click",()=>{
            data = get_transactions()
            newdata = delete_transaction(transaction.id,data)
            set_transactions(newdata)
            renderUI(newdata)
            calculate_summary(newdata)
        })

        transactions_listEl.appendChild(transactionEl)
    })
}

function delete_transaction(id,data){
    newdata = data.filter((item)=>item.id != id)
    return newdata

}

function edit_transaction(id,data,newitem){
    newdata = data.map((item)=>{
        if(item.id === id){
            return newitem
        }else{
            return item
        }
    })
    return newdata
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

function calculate_summary(data){
    const income = data.filter((item)=>item.type == "income").reduce((sum,item)=>sum+Number(item.amount),0)
    const expense = data.filter((item)=>item.type == "expense").reduce((sum,item)=> sum+Number(item.amount),0)
    const balance = income-expense
    incomeEl.textContent = income
    expenseEl.textContent = expense
    balanceEl.textContent = balance
    return
}

function filter_type(type){
    const mydata = get_transactions()
    if(type == "all"){
        renderUI(mydata)
        return
    }
    const filtered_data = mydata.filter((item)=>item.type == type)
    renderUI(filtered_data)
    return
}