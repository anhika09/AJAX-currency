const currency = document.getElementById("currency");
const fromDate = document.getElementById("from-date");
const toDate = document.getElementById("to-date");
const GetRate = document.getElementById("btnRate");
const sectionData = document.getElementById("data");
const BASE_URL = "https://bank.gov.ua/NBU_Exchange/exchange_site?";

GetRate.addEventListener("click", () => {
  if (!currency.value || !fromDate.value || !toDate.value) {
    alert("Please select a currency and both dates.");
    return;
  }

  const startStr = fromDate.value.split("-").join("");
  const endStr = toDate.value.split("-").join("");

  const URI = `${BASE_URL}start=${startStr}&end=${endStr}&valcode=${currency.value}&sort=exchangedate&order=asc&json`;
  const XHR = new XMLHttpRequest();
  XHR.open("GET", URI);

  XHR.addEventListener("readystatechange", () => {
    if (XHR.readyState === 4) {
      if (XHR.status === 200) {
        const data = JSON.parse(XHR.responseText);
        if (data.length === 0) {
          alert("No data found for these dates.");
          return;
        }

        const chartDataPoints = data.map((item) => {
          const parts = item.exchangedate.split(".");
          return {
            x: new Date(parts[2], parts[1] - 1, parts[0]),
            y: item.rate,
          };
        });
        const chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          theme: "light2",
          title: { text: `${currency.value.toUpperCase()} Exchange Rate` },
          axisX: { valueFormatString: "DD MMM" },
          axisY: { title: "Rate (UAH)", includeZero: false },
          data: [
            {
              type: "line",
              xValueType: "dateTime",
              dataPoints: chartDataPoints,
            },
          ],
        });

        chart.render();
      } else {
        alert("Error connecting to the API.");
      }
    }
  });
  XHR.send();
});
