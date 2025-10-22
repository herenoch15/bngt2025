import AsyncStorage from '@react-native-async-storage/async-storage';

const textes = {
    fr: {
        titre: 'Carte interactive',
        recherche: 'Recherche'
    },

    en: {
        titre: 'Interactive map',
        recherche: 'Search'
    },
}

const getText = async () => {
    const lang = await AsyncStorage.getItem('@lang')
    return textes[lang]
}

export default {
    getText
}
