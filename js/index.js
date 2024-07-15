import customersData from "./data.js";
import showGrapg from "./drawGraph.js";

// Create Map
const mapUsers = new Map();

// mapUsers =  { key: customer_id, value: {name: name, totalTransactions: +=amount, amount: [], day: []} }
customersData.customers.forEach((customer) =>
  mapUsers.set(customer.id, {
    name: customer.name,
    totalTransactions: 0,
    amount: [],
    day: [],
  })
);

// put data users in Map(mapUsers)
customersData.transactions.forEach((customerTransaction) => {
  const user = mapUsers.get(customerTransaction.customer_id);
  user.totalTransactions += customerTransaction.amount;
  user.amount.push(customerTransaction.amount);
  user.day.push(new Date(customerTransaction.date));
});

// when open page show all data in table
uiTable(mapUsers);

// create ui table for users
function uiTable(mapUsers, amountSearch) {
  let uiTable = "";
  mapUsers.forEach((user, key) => {
    uiTable += `<tr><td>${user.name}</td><td>`;

    // mark data filter amount results in table
    if (amountSearch) {
      user.amount.forEach((amount) => {
        if (amount == amountSearch) {
          uiTable += `<span class="bg-warning"> ${amount} </span> `;
        } else {
          uiTable += ` ${amount} `;
        }
      });
    } else {
      uiTable += ` ${user.amount} `;
    }

    uiTable += `</td><td>${user.totalTransactions}</td>
                <td><button userId=${key} type="button" class="btn btn-outline-primary">View Graph</button></td>
                </tr>
                `;
  });

  // show data
  $("table tbody").html(uiTable);

  viewGraphBtnEvent()
}

// show search input
function showSearchInput() {
  const searchInput = $("#search");
  if (searchInput.hasClass("d-none")) {
    searchInput.removeClass("d-none");
  }
}

// filter by name
$("#fName").on("change", function () {
  if ($(this).is(":checked")) {
    $("#search label").html("Filter By Name");
    showSearchInput();
    $(".searchInput").on("keyup", function () {
      const nameSearch = $(this).val();
      uiTable(filterByName(mapUsers, nameSearch), null, nameSearch);
    });
  }
});

// filter by amount
$("#fAmount").on("change", function () {
  if ($(this).is(":checked")) {
    $("#search label").html("Filter By Amount");
    showSearchInput();
    $(".searchInput").on("keyup", function () {
      let amountSearch = $(this).val();
      if (amountSearch == "") {
        return uiTable(mapUsers);
      }
      amountSearch = Number(amountSearch);
      return uiTable(filterByAmount(mapUsers, amountSearch), amountSearch);
    });
  }
});

function filterByName(map, name) {
  let filteredMap = new Map();
  map.forEach((user, key) => {
    let regex = new RegExp(name, "i");
    if (regex.test(user.name)) {
      filteredMap.set(key, user);
    }
  });
  return filteredMap;
}

function filterByAmount(map, amount) {
  let filteredMap = new Map();
  map.forEach((value, key) => {
    if (value.amount.includes(amount)) {
      filteredMap.set(key, value);
    }
  });
  return filteredMap;
}

// event on btn to show graph
function viewGraphBtnEvent() {
  $("button").on("click", function () {
    const userId = +$(this).attr("userId");
    const user = mapUsers.get(userId);
    const userTransaction = user.day.map((day, index) => ({
      name: user.name,
      day: day,
      amount: user.amount[index],
    }));

    // sort by date
    userTransaction.sort((a, b) => a.day.getTime() - b.day.getTime());

    let userObj = { name: userTransaction[0].name, day: [], totalAmount: [] };
    userTransaction.forEach((transaction) => {
      const fullDay = String(transaction.day).split(" ");
      const day =
        fullDay[0] + " " + fullDay[1] + " " + fullDay[2] + " " + fullDay[3];

      if (userObj.day.includes(day)) {
        let index = userObj.day.indexOf(day);
        userObj.totalAmount[index] += transaction.amount;
      } else {
        userObj.day.push(day);
        userObj.totalAmount.push(transaction.amount);
      }
    });

    // show grapg in thml
    showGrapg(userObj);
  });
}
