const _templates = {
  section: function (region) {
    return `<div class="region border p-1 mb-2">
          <h3>${region}</h3>
          <div class="region-countries pl-3" id="block-${region
            .replace(/\s+/g, "")
            .replace("(", "")
            .replace(")", "")}"></div>
        </div>`;
  },
  countryListing: function (data) {
    return `<p class="country" code=${data.cca2} capital=${
      data.capital ? data.capital[0] : "unavailable"
    } language=${
      data.languages && data.languages[Object.keys(data.languages)[0]]
    }>${data.name.common}</p>`;
  },
};

console.log($("#region"));

let allDetails;

$.ajax({
  url: "https://restcountries.com/v3.1/all",
  type: "GET",
  dataType: "json", // added data type
  success: function (res) {
    console.log(res);
    let regionGrouped = res.reduce(function (result, current) {
      result[current.region] = result[current.region] || [];
      result[current.region].push(current);
      return result;
    }, {});
    let languageGrouped = res.reduce(function (result, current) {
      for (var language in current.languages) {
        result[current.languages[language]] =
          result[current.languages[language]] || [];
        result[current.languages[language]].push(current);
      }
      return result;
    }, {});
    let currencyGrouped = res.reduce(function (result, current) {
      for (var currency in current.currencies) {
        for (var currencyName in currency) {
          result[current.currencies[currency][currencyName]] =
            result[current.currencies[currency][currencyName]] || [];
          result[current.currencies[currency][currencyName]].push(current);
        }
      }
      return result;
    }, {});

    console.log(currencyGrouped);

    let regionsList = Object.keys(regionGrouped);
    let languageList = Object.keys(languageGrouped);
    // console.log(regionsList);

    // appending regions tab
    for (regionCount in regionsList) {
      let currentRegion = regionsList[regionCount];

      $("#region").append(_templates.section(currentRegion));

      for (countryCount in regionGrouped[currentRegion]) {
        let currentCountry = regionGrouped[currentRegion][countryCount];
        $(`#block-${currentRegion}`).append(
          _templates.countryListing(currentCountry)
        );
      }
    }

    // appending languages tab
    for (languageCount in languageList) {
      let currentLanguage = languageList[languageCount];

      $("#language").append(_templates.section(currentLanguage));

      for (countryCount in languageGrouped[currentLanguage]) {
        let currentCountry = languageGrouped[currentLanguage][countryCount];
        $(
          `#block-${currentLanguage
            .replace(/\s+/g, "")
            .replace("(", "")
            .replace(")", "")}`
        ).append(_templates.countryListing(currentCountry));
      }
    }
  },
});

function searchCountries() {
  let searchField = $("#search-field");
  let filterText = searchField.val().toLowerCase();
  let listedCountries = $(".country");

  //   console.log(listedCountries);

  for (let index = 0; index < listedCountries.length; index++) {
    const listedCountry = listedCountries[index];
    let countryName = $(listedCountry).text().toLowerCase();
    let countryCode = $(listedCountry).attr("code").toLowerCase();
    let countryCapital = $(listedCountry).attr("capital").toLowerCase();
    let countryLanguage = $(listedCountry).attr("language").toLowerCase();
    if (
      countryName.toLowerCase().indexOf(filterText) > -1 ||
      countryCode.toLowerCase().indexOf(filterText) > -1 ||
      countryCapital.toLowerCase().indexOf(filterText) > -1 ||
      countryLanguage.toLowerCase().indexOf(filterText) > -1
    ) {
      $(listedCountry).removeClass("d-none");
    } else {
      $(listedCountry).addClass("d-none");
    }
  }
}

$("body").on("click", ".country", function () {
  let countryName = $(this).text();
  document.location.href = `./details.html?country=${countryName}`;
});
