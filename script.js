let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

const themeBtn =
document.getElementById("themeBtn");

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
    }
    else{
        localStorage.setItem("theme","light");
    }

});

function saveData(){
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function addTransaction(){

    const desc =
    document.getElementById("desc").value;

    const amount =
    Number(document.getElementById("amount").value);

    const category =
    document.getElementById("category").value;

    const type =
    document.getElementById("type").value;

    if(desc==="" || amount<=0){
        alert("Enter valid data");
        return;
    }

    transactions.push({
        desc,
        amount,
        category,
        type
    });

    saveData();

    document.getElementById("desc").value="";
    document.getElementById("amount").value="";

    render();
}

function deleteTransaction(index){

    transactions.splice(index,1);

    saveData();

    render();
}

function render(){

    const list =
    document.getElementById("list");

    const search =
    document.getElementById("search")
    .value
    .toLowerCase();

    list.innerHTML="";

    let balance = 0;

    transactions.forEach((item,index)=>{

        balance +=
        item.type==="income"
        ? item.amount
        : -item.amount;

        if(
            item.desc
            .toLowerCase()
            .includes(search)
        ){

            list.innerHTML += `
            <li>
                ${item.desc}
                | ${item.category}
                | ₹${item.amount}
                | ${item.type}

                <button
                onclick="deleteTransaction(${index})">
                Delete
                </button>
            </li>
            `;
        }

    });

    document.getElementById("balance")
    .innerText =
    `Balance: ₹${balance}`;

    updateChart();
}

function updateChart(){

    let categoryData = {};

    transactions
    .filter(item => item.type==="expense")
    .forEach(item=>{

        categoryData[item.category] =
        (categoryData[item.category] || 0)
        + item.amount;

    });

    const labels =
    Object.keys(categoryData);

    const values =
    Object.values(categoryData);

    if(chart){
        chart.destroy();
    }

    chart = new Chart(
        document.getElementById("chart"),
        {
            type:"doughnut",
            data:{
                labels:labels,
                datasets:[
                    {
                        data:values
                    }
                ]
            }
        }
    );
}

render();