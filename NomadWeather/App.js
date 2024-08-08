import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const API_KEY = '52ae5083c1f59f97a4eec95439606081';

const icons = {
    Clouds: 'cloudy',
    Clear: 'day-sunny',
    Atmosphere: 'cloudy-gusts',
    Snow: 'snow',
    Rain: 'rains',
    Drizzle: 'rain',
    Thunderstorm: 'lightning',
};

export default function App() {
    const [city, setCity] = useState('Loading...');
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);
    const getWeather = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
            accuracy: 5,
        });
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        setCity(location[0].region);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );
        const json = await response.json();
        setDays(json.weather);
        console.log(json);
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator color="white" size="large" />
                    </View>
                ) : (
                    <View style={styles.day}>
                        <Fontisto
                            name={icons[days[0].main]}
                            size={68}
                            color="white"
                        />
                        <Text style={styles.temp}>{days[0].main}</Text>
                        <Text style={styles.desc}>{days[0].description}</Text>
                    </View>
                )}
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'tomato',
    },
    city: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cityName: {
        fontSize: 68,
        fontWeight: '500',
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
    },
    temp: {
        marginTop: 50,
        fontSize: 100,
    },
    desc: {
        fontSize: 20,
    },
});
