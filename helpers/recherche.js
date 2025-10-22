import AsyncStorage from '@react-native-async-storage/async-storage';

const textes = {
    fr: {
        titre: "Recherche",
        mot:{
            titre: "Mot Clé",
            placeholder: "Saissisez un nom, une commune"
        },
        cate: {
            titre: "Catégorie",
            placeholder: "Toutes les catégories"
        },
        sous: {
            titre: "Sous catégorie",
            placeholder: "Tous les sous-catégories"
        },
        theme: {
            titre: "Thématique",
            placeholder: "Tous les thématiques"
        },
        btn: "Valider"
    },

    en: {
        titre: "Search",
        mot:{
            titre: "Keyword",
            placeholder: "Enter a name, a town"
        },
        cate: {
            titre: "Category",
            placeholder: "All categories"
        },
        sous: {
            titre: "Sub-category",
            placeholder: "All subcategories"
        },
        theme: {
            titre: "Theme",
            placeholder: "All themes"
        },
        btn: "Validate"
    },
}

const getText = async () => {
    const lang = await AsyncStorage.getItem('@lang')
    return textes[lang]
}

export default {
    getText
}
