const _templates = {
  countryDetails: function (data) {
    return `<p><span class="font-weight-bold">Capital:</span> ${data.capital[0]}</p>
            <p><span class="font-weight-bold">Region:</span> ${data.region}</p>
            <p><span class="font-weight-bold">Sub-Region:</span> ${data.subregion}</p>
            <p><span class="font-weight-bold">Population:</span> ${data.population}</p>`;
  },
  countryFlag: function (data) {
    return `<img src="${data.flags.png}" alt="">`;
  },
};

let searchParams = new URLSearchParams(window.location.search);
if (searchParams.has("country")) {
  $.ajax({
    url: `https://restcountries.com/v3.1/name/${searchParams.get("country")}`,
    type: "GET",
    dataType: "json", // added data type
    success: function (res) {
      $("#country-name").append(res[0].name.common);
      $("#country-details").append(_templates.countryDetails(res[0]));
      $("#country-content").append(_templates.countryFlag(res[0]));
    },
  });
} else {
  alert("Page not found");
}
