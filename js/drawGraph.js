export default function drawGrapg(userObj) {
  const ctx = $("#myChart");

  if (myChart) {
    myChart.destroy();
  }

  // Creating a new chart using Chart.js library
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: userObj.day,
      datasets: [
        {
          label: "# of Total Transactions",
          data: userObj.totalAmount,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: userObj.name,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
let myChart = null;
