import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { MagnifyingGlassIcon as SearchIcon } from "react-native-heroicons/outline";
import { MapPinIcon as MapIcon } from "react-native-heroicons/solid";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from "react-native-progress";
import rainIcon from "../assets/images/moderaterain.png";
import immigration from "../assets/DaeguImmigration.jpeg";

export default function HomeScreen() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  console.log("icons:", weatherImages);
  console.log(
    "weather?.forecast?.forecastday?",
    weather?.forecast?.forecastday
  );
  const handelLocation = (loc) => {
    console.log(locations);
    setLocations([]);
    setShowSearchBar(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      console.log(data);
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => setLocations(data));
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({ cityName: "Daegu", days: "7" }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  const handleDebounce = useCallback(debounce(handleSearch, 1000), []);
  const { current, location } = weather;

  return (
    <View className="h-[7] flex-1 relative">
      <StatusBar style="light" />
      {/* <Image
        blurRadius={13}
        source={{
          uri: "https://i.pinimg.com/736x/cf/37/59/cf3759d8676ccb5f629c45e7d204fb05.jpg",
        }}
        className="h-full w-full absolute"
      /> */}
      <ImageBackground
        source={immigration}
        resizeMode="cover"
        style={styles.image}
      >
        {loading ? (
          <View className="flex-1 flex-row justify-center items-center">
            <Progress.CircleSnail thickness={10} size={140} color="white" />
          </View>
        ) : (
          <SafeAreaView className="flex flex-1">
            <View className=" mx-4 relative z-50">
              <View
                className="flex-row justify-end items-center rounded-full "
                style={{
                  backgroundColor: showSearchBar
                    ? theme.bgWhite(0.2)
                    : "transparent",
                }}
              >
                {showSearchBar ? (
                  <TextInput
                    onChangeText={handleDebounce}
                    placeholder="Search City"
                    placeholderTextColor={"white"}
                    className="h-12 pl-4 text-xl pb-1 flex-1"
                  />
                ) : null}

                <TouchableOpacity
                  onPress={() => setShowSearchBar(!showSearchBar)}
                  style={{ backgroundColor: theme.bgWhite(0.3) }}
                  className="p-3 rounded-full m-1"
                >
                  <SearchIcon size={25} color="white" />
                </TouchableOpacity>
              </View>
              {locations.length > 0 && showSearchBar ? (
                <View
                  className=" absolute w-full top-16 rounded-3xl "
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    borderBottomColor: "#f0f0f0",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {locations.map((loc, index) => {
                    let showBorder = index + 1 != locations.length;
                    let borderClass = showBorder
                      ? "border-b-2 border-b-gray-400"
                      : "";
                    return (
                      <TouchableOpacity
                        onPress={() => handelLocation(loc)}
                        key={index}
                        className={
                          "flex-row items-center m-1 p-3  px-4 " + borderClass
                        }
                      >
                        <MapIcon size={20} color={"black"} />
                        <Text className="text-black font-bold text-lg ml-2">
                          {loc?.name}, {loc?.country}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>

            <View className="flex-1 flex justify-around mx-4 mb-2">
              <View className="flex-row items-center justify-center">
                <Text className="text-white text-3xl font-bold items-center justify-center">
                  {location?.name},
                </Text>
                <Text className="text-lg text-white font-semibold items-center justify-center">
                  {" " + location?.country}
                </Text>
              </View>

              <View className="justify-center flex-row">
                <Image
                  source={weatherImages[current?.condition?.text]}
                  className="w-52 h-52"
                />
              </View>

              <View className="">
                <Text className="text-center text-6xl text-white font-bold">
                  {current?.temp_c}&#176;
                </Text>
                <Text className="text-center text-xl text-white tracking-widest">
                  {current?.condition?.text}
                </Text>
              </View>
              {/* WEATHER CONDITIONS */}
              <View>
                <View className="flex-row space-x-6 items-center ">
                  <View className="ml-8 flex-row space-x-1 items-center">
                    <Feather name="wind" size={30} color="white" />
                    <Text className="items-center text-white text-lg font-semibold">
                      {current?.wind_kph} km
                    </Text>
                  </View>
                  <View className="ml-2 flex-row space-x-1 items-center">
                    <Entypo name="drop" size={30} color="white" />
                    <Text className="items-center text-white text-lg font-semibold">
                      {current?.humidity}%
                    </Text>
                  </View>
                  <View className="ml-2 flex-row space-x-1 items-center">
                    <Feather name="sun" size={30} color="white" />
                    <Text className="items-center text-white text-lg font-semibold">
                      14km
                    </Text>
                  </View>
                </View>
              </View>
              {/* NEXT DAYS FORCAST */}
              <View className="flex-row items-center ml-2 ">
                <FontAwesome name="calendar" size={30} color="white" />
                <Text className="text-white font-semibold ml-3 text-lg">
                  Daily Forcast
                </Text>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {weather?.forecast?.forecastday?.map((days, index) => {
                    let date = new Date(days.date);
                    let options = { weekday: "long" };
                    let dayName = date.toLocaleDateString("en-US", options);
                    return (
                      <View
                        key={index}
                        className=" w-32 rounded-3xl py-4 px-5 ml-3"
                        style={{ backgroundColor: theme.bgBlack(0.7) }}
                      >
                        <Image
                          source={
                            weatherImages[days?.day?.condition?.text] ||
                            rainIcon
                          }
                          className="w-12 h-12 ml-5"
                        />
                        <Text className="text-slate-300 font-semibold text-center py-1">
                          {dayName}
                        </Text>
                        <Text className="text-white font-semibold text-lg text-center">
                          {days?.day?.avgtemp_c}&#176;
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </SafeAreaView>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "space-around",
  },
  wrapper: {
    opacity: 0.9,
  },
  cityText: {
    color: "white",
    fontSize: 18,
    fontWeight: 800,
  },
});
