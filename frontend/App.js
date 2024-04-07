import { SafeAreaView, Text, View } from "react-native";
import { Rings } from "./components/Rings";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [realtimeValue, setRealtimeValue] = useState(0);
  const [readingsValue, setReadingsValue] = useState(0);
  useEffect(() => {
    const getData = () => {
      axios
        .get("http://192.168.0.101:5000")
        .then((res) => {
          const { readings, realtime } = res.data;
          setReadingsValue(readings.toFixed(5));
          setRealtimeValue(realtime);
        })
        .catch((err) => {
          // console.log(JSON.stringify(err));
        });
    };
    const interval = setInterval(() => {
      getData();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <SafeAreaView className="flex-1 pt-10">
      <Text className="h-10 text-white bg-black text-center">E-meter</Text>
      <View className="flex-1 border ">
        <Rings readings={readingsValue} realtime={realtimeValue} />
      </View>
      <View className="absolute left-28 top-[700px] ">
        <Text className="text-xl text-center  text-white">Today : {readingsValue} kwh</Text>
        <Text className="text-xl text-center  text-white">This Week : {readingsValue} kwh</Text>
        <Text className="text-xl text-center  text-white">This Month : {readingsValue} kwh</Text>

        <Text className="text-xl text-center  text-white">Real-Time Readings</Text>
        <Text className="text-xl text-center  text-white">Watts : {realtimeValue}W</Text>
      </View>
    </SafeAreaView>
  );
}
