// Generate realistic home care data
// 30 clients, 60 visits, 10 employees

const clients = [
  { name: "Maj-Britt Nilsson", address: "Götgatan 12", phone: "08-123 45 67" },
  { name: "Sven Persson", address: "Ringvägen 45", phone: "08-234 56 78" },
  { name: "Ahmed Al-Rashid", address: "Folkungagatan 88", phone: "08-345 67 89" },
  { name: "Elsa Demba", address: "Sockenvägen 23, Enskede", phone: "08-456 78 90" },
  { name: "Bengt Larsson", address: "Ringvägen 102", phone: "08-567 89 01" },
  { name: "Kerstin Öst", address: "Bondegatan 55", phone: "08-678 90 12" },
  { name: "Gunnar Ek", address: "Skånegatan 71", phone: "08-789 01 23" },
  { name: "Astrid Johansson", address: "Nytorgsgatan 34", phone: "08-890 12 34" },
  { name: "Kalle Berg", address: "Åsögatan 144", phone: "08-901 23 45" },
  { name: "Inga-Lill Olsson", address: "Katarina Bangata 68", phone: "08-012 34 56" },
  { name: "Hans Müller", address: "Blekingegatan 22", phone: "08-112 33 44" },
  { name: "Birgitta Svensdotter", address: "Hornsgatan 154", phone: "08-223 44 55" },
  { name: "Per-Ove Andersson", address: "Långholmsgatan 31", phone: "08-334 55 66" },
  { name: "Elisabeth Dahl", address: "Wollmar Yxkullsgatan 12", phone: "08-445 66 77" },
  { name: "Karl-Erik Holm", address: "Fatbursgatanatan 8", phone: "08-556 77 88" },
  { name: "Margareta Viklund", address: "Renstiernas gata 19", phone: "08-667 88 99" },
  { name: "Bertil Gustafsson", address: "Tjärhovsgatan 45", phone: "08-778 99 00" },
  { name: "Ann-Marie Karlsson", address: "Södermannagatan 66", phone: "08-889 00 11" },
  { name: "Rolf Pettersson", address: "Malmgårdsvägen 15, Enskede", phone: "08-990 11 22" },
  { name: "Sonja Lindberg", address: "Enskedevägen 88, Enskede", phone: "08-101 22 33" },
  { name: "Stig Larsson", address: "Johannesfredsvägen 12, Enskede", phone: "08-212 33 44" },
  { name: "Ingrid Nilsson", address: "Sockenplan 3, Enskede", phone: "08-323 44 55" },
  { name: "Olle Bergman", address: "Sturevägen 4, Enskede", phone: "08-434 55 66" },
  { name: "Karin Lund", address: "Björnbärsvägen 9, Enskede", phone: "08-545 66 77" },
  { name: "Gösta Nordin", address: "Lingonvägen 21, Enskede", phone: "08-656 77 88" },
  { name: "Eva Strömberg", address: "Tallkrogen 5, Enskede", phone: "08-767 88 99" },
  { name: "Nils Fernström", address: "Skogsbacken 18, Enskede", phone: "08-878 99 00" },
  { name: "Barbro Eklund", address: "Lundavägen 7, Enskede", phone: "08-989 00 11" },
  { name: "Arne Vikström", address: "Stureby allé 24, Enskede", phone: "08-090 11 22" },
  { name: "Gudrun Åberg", address: "Enskedepolen 2, Enskede", phone: "08-191 22 33" }
];

console.log(JSON.stringify(clients, null, 2));
