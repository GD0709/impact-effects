
class Author {
    constructor(    
        last_name?: string,
        initials?: string
    ) {
        this.last_name = last_name;
        this.initials = initials;
    }
    last_name?: string;
    initials?: string;
}
enum Languages {
    English,
    Russian
  }

class PublicationLink {
    constructor(url: string, display_name?: string, prefix?: string)
    {
        this.url = url;
        this.display_name = display_name;
        this.prefix = prefix;
    }
    prefix?: string;
    display_name?: string;
    url: string;
}
class Publication {
    constructor(
        id: number,
        authors: Author[],
        year?: string,
        title?: string,
        journal?: string,
        vol_number_pages?: string)
    {
        this.id = id;
        this.authors = authors;
        this.year = year;
        this.title = title;
        this.journal = journal;
        this.vol_number_pages = vol_number_pages;
    }
    id: number;
    language?:Languages;
    authors: Author[];
    year?: string;
    title?: string;
    journal?: string;
    vol_number_pages?: string;
    links?:PublicationLink[];
    
    public add_link(prefix: string, url: string, display_name?: string): Publication {

        if (this.links == null)
            this.links = []
        this.links.push(new PublicationLink(url, display_name, prefix))
        return this;
    }


    to_long_styled_output(): string {
        var res = this.authors.map(a => a.last_name + ", " + a.initials).join(", ")
        if (this.year != null)
            res += " (" + this.year + ")";
        
        if (this.title != null)
            res += " " + this.title;
        if (this.journal != null)
            res += " // " + this.journal;

        if (this.vol_number_pages != null)
            res += ". " + this.vol_number_pages;

        return res;
    }

    to_short_link_output(): string {
        var res = "[";
        if (this.authors.length >= 3) 
            res += this.authors[0].last_name + " et al., " + this.year 
        else if (this.authors.length == 2) 
            res += this.authors[0].last_name + " and " + this.authors[1].last_name + ", " + this.year 
        else if (this.authors.length == 1)
            res += this.authors[0].last_name + ", " + this.authors[0].last_name
    
        res += "]";
        return res;
    }
}
const Artemieva: Author = new Author("Artemieva", "N. A.")
const Shuvalov: Author = new Author("Shuvalov", "V. V.")
const Glazachev: Author = new Author("Glazachev", "D. O.")
const Popova: Author = new Author("Popova", "O. P.")
const Svettsov: Author = new Author("Svettsov", "V. V.")
const Trubetskaya: Author = new Author("Trubetskaya", "I. A.")
const Podobnaya: Author = new Author("Podobnaya", "E. D.")
const Khazins: Author = new Author("Khazins", "V. M.")
const Kartashova: Author = new Author("Kartashova", "A. P.")
const Jenniskens: Author = new Author("Jenniskens", "P.")
const Emelyanenko: Author = new Author("Emel\'yanenko", "V. V.")
const Skripnik: Author = new Author("Skripnik", "A. Ya.")
const Turuntaev: Author = new Author("Turuntaev", "I. S.")
const Naroenkov: Author = new Author("Naroenkov", "S. A.")

var publications:  Record<number, Publication> = {
    1: new Publication(1, [Artemieva, Shuvalov ], "2016", "From Tunguska to Chelyabinsk via Jupiter", "Annual Review of Earth and Planetary Sciences", "44, 37-56"),
    2: new Publication(2, [Shuvalov, Artemieva, Glazachev, Popova, Svettsov], "2016", "Numerical Model of an Apophis-Like Impact Against The Earth", "79th Annual Meeting of the Meteoritical Society, held 7-12 August, 2016 in Berlin, Germany", "LPI Contribution No. 1921, id.6087"),
    3: new Publication(3, [Shuvalov, Svettsov, Artemieva, Trubetskaya, Popova, Glazachev], "2017", "Asteroid Apophis: Evaluating the Impact Hazards of such Bodies", "Solar System Research", "51(1), 44-58"),  
    4: new Publication(4, [Artemieva, Shuvalov, Svettsov], "2017", "Airbursts: We Will Shock You!", "80th Annual Meeting of the Meteoritical Society, held July 23-28, 2017 in Santa Fe, New Mexico", "LPI Contribution No., 1987, id.6041"),  
    5: new Publication(5, [Popova, Glazachev, Podobnaya, Svettsov, Shuvalov], "2017", "Radiation of Large Meteoroids Decelerated in the Earth's Atmosphere", "80th Annual Meeting of the Meteoritical Society, held July 23-28, 2017 in Santa Fe, New Mexico", "LPI Contribution No., 1987, id.6376"),  
    6: new Publication(6, [Svettsov, Artemieva, Shuvalov], "2017", "Seismic Efficiency of Meteor Airbursts", "Doklady Earth Sciences", "475(2), 935-938"),  
    7: new Publication(7, [Svettsov, Shuvalov], "2017", "Effects Of Thermal Radiation From Impact Plumes", "80th Annual Meeting of the Meteoritical Society, held July 23-28, 2017 in Santa Fe, New Mexico", "LPI Contribution No., 1987, id.6132"),  
    8: new Publication(8, [Shuvalov, Svettsov, Popova, Glazachev], "2017", "Numerical Model Of The Chelyabinsk Meteoroid As A Strengthless Object", "Planetary and Space Science", "147, 38-47"), 
    9: new Publication(9, [Shuvalov, Khazins],"2017", "Ionospheric Disturbances Initiated by Explosive Disruption of Chelyabinsk and Tunguska Cosmic Bodies", "80th Annual Meeting of the Meteoritical Society, held July 23-28, 2017 in Santa Fe, New Mexico", "LPI Contribution No., 1987, id.6044"),  
    10: new Publication(10, [Shuvalov, Khazins], "2018", "Numerical Simulation of Ionospheric Disturbances Generated by the Chelyabinsk and Tunguska Space Body Impacts", "Solar System Research", "52(2), 129-138"), 
    11: new Publication(11, [Svettsov, Shuvalov, Popova], "2018", "Radiation from a Superbolide", "Solar System Research", "52(3), 195-205"),  
    12: new Publication(12, [Glazachev, Podobnaya, Popova, Artemieva, Shuvalov], "2018", "Scaling Relations for Shock Wave Effects from Large Meteoroids Decelerated In The Earth's Atmosphere", "81st Annual Meeting of the Meteoritical Society, held 22-27 July 2018 in Moscow, Russia", "LPI Contribution No. 2067, id.6032"),  
    13: new Publication(13, [Kartashova,Popova,Glazachev,Jenniskens,Emelyanenko, Podobnaya, Skripnik], "2018", "Study of Injuries from the Chelyabinsk Airburst Event", "Planetary and Space Science", "160, 107-114"),  
    14: new Publication(14, [Kartashova,Popova,Glazachev,Jenniskens,Podobnaya ], "2018", "Eyewitness Accounts and Modeling Results for Chelyabinsk Airburst", "81st Annual Meeting of the Meteoritical Society, held 22-27 July 2018 in Moscow, Russia", "LPI Contribution No. 2067, id.6169"),  
    15: new Publication(15, [Naroenkov, Glazachev, Kartashova, Popova], "2018", "The Constructor of Orbits for the Impact Effect Calculator", "81st Annual Meeting of the Meteoritical Society, held 22-27 July 2018 in Moscow, Russia", "LPI Contribution No. 2067, id.6317"),  
    16: new Publication(16, [Naroenkov, Glazachev, Kartashova, Popova, Turuntaev], "2018", "The Impact Effect Callculator of Celestial Body Impacts to the Earth: The Constructor of Hazardous Orbits", "Solar System Research", "52(6), 534-546"),  
    17: new Publication(17, [Podobnaya, Glazachev, Popova, Svettsov, Shuvalov], "2018", "Scaling Relations for Radiation Effects due to Impacts of Large Cosmic Objects", "81st Annual Meeting of the Meteoritical Society, held 22-27 July 2018 in Moscow, Russia", "LPI Contribution No. 2067, id.6030"),  
    18: new Publication(18, [Svettsov, Shuvalov], "2018", "Thermal Radiation and Luminous Efficiency of Superbolides", "Earth and Planetary Science Letters", "503, 10-16"),  
    19: new Publication(19, [Svettsov, Shuvalov, Artemieva, Khazins, Popova, Glazachev, Podobnaya], "2018", "Complex Assessment of Hazardous Effects of Impacts of Cosmic Objects", "81st Annual Meeting of the Meteoritical Society, held 22-27 July 2018 in Moscow, Russia", "LPI Contribution No. 2067, id.6145"),  
    20: new Publication(20, [Khazins, Shuvalov, Svettsov], "2018", "The Seismic Efficiency of Space Body Impacts", "Solar System Research", "52(6), 547-556"),  
    21: new Publication(21, [Shuvalov, Khazins, Svettsov], "2018", "Estimation of Seismic Efficiency of Impacts of Cosmic Objects by Methods of Numerical Analysis", "81st Annual Meeting of the Meteoritical Society, held 22-27 July 2018 in Moscow, Russia", "LPI Contribution No. 2067, id.6068"),  
    22: new Publication(22, [Artemieva, Shuvalov], "2019", "Atmospheric Shock Waves after Impacts of Cosmic Bodies up to 1000 m in Diameter", "Meteoritics and Planetary Science", "54(3), 592-608"),  
    23: new Publication(23, [Svettsov, Shuvalov], "2019", "Thermal Radiation from Impact Plumes", "Meteoritics and Planetary Science", "54(1), 126-141"),
    24: new Publication(24, [Shuvalov, Popova, Svettsov, Trubetskaya, Glazachev], "2016", "Determination of the height of the \"meteoric explosion\"", "Solar System Research", "50(1), 1-12")
        .add_link("eLIBRARY", "https://elibrary.ru/item.asp?id=26930802", "26930802")
        .add_link("DOI", "https://doi.org/10.1134/S0038094616010056", "10.1134/S0038094616010056"),
    25: new Publication(25, [Glazachev, Popova, Podobnaya, Artemieva, Shuvalov, Svettsov], "2021", "Shock Wave Effects from the Impacts of Cosmic Objects with Diameters from 20 m to 3 km", "Izvestiya, Physics of the Solid Earth", "Vol. 57, No. 5. – P. 698-709.")
        .add_link("eLIBRARY", "https://www.elibrary.ru/item.asp?id=47524149", "47524149")
        .add_link("DOI", "https://doi.org/10.1134/S1069351321050050", "10.1134/S1069351321050050"),
    26: new Publication(26, [Glazachev, Popova, Podobnaya, Shuvalov, Artemieva, Svettsov], "2021", "Местоположение центра \"метеорного взрыва\"", "Динамические процессы в геосферах.", "№ 13. – С. 98-107. ")
        .add_link("eLIBRARY", "https://www.elibrary.ru/item.asp?id=47474630", "47474630")
        .add_link("DOI", "https://doi.org/10.26006/22228535_2021_1_98", "10.26006/22228535_2021_1_98"),
        
};





export { Author, Publication, Languages, publications }