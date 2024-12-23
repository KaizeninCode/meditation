import { View, Text, ImageBackground, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import meditationImages from "@/constants/meditation-images";
import AppGradient from "@/components/AppGradient";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomButton from "@/components/CustomButton";
import { Audio } from "expo-av";
import { MEDITATION_DATA, AUDIO_FILES } from "@/constants/MeditationData";
import { TimerContext } from "@/context/TimerContext";

const Meditate = () => {
  const { id } = useLocalSearchParams();

  const { duration, setDuration } = useContext(TimerContext)

  // const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [meditating, setMeditating] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let timerId = NodeJS.Timeout;

    if (duration === 0) {
      setMeditating(false);
      return;
    } else {
      if (meditating)
        timerId = setTimeout(
          () => setDuration(duration - 1),
          1000
        );
    }

    return () => clearTimeout(timerId);
  }, [duration, meditating]);

  useEffect(() => {
    () => sound?.unloadAsync();
    setDuration(10)
  }, [sound]);

  const toggleMeditationSessionStatus = async () => {
    if (secondsRemaining === 0) setSecondsRemaining(10);
    setMeditating(!meditating);
    await toggleSound();
  };

  const toggleSound = async () => {
    const s = sound ? sound : await initializeSound();

    const status = await s?.getStatusAsync();

    if (status?.isLoaded && !playing) {
      await s.playAsync();
      setPlaying(true);
    } else {
      await s.pauseAsync();
      setPlaying(false);
    }
  };

  const initializeSound = async () => {
    const audioFileName = MEDITATION_DATA[Number(id) - 1].audio;
    const { sound } = await Audio.Sound.createAsync(AUDIO_FILES[audioFileName]);
    setSound(sound);
    return sound;
  };

  const handleAdjustDuration = () => {
    if (meditating) toggleMeditationSessionStatus()
    
    router.push('/(modal)/adjust-meditation-duration')  
  }

  // format the time left to display two digits
  const formattedTimeMinutes = String(
    Math.floor(duration / 60)
  ).padStart(2, "0");
  const formattedTimeSeconds = String(duration % 60).padStart(2, "0");

  return (
    <View className="flex-1">
      <ImageBackground
        source={meditationImages[Number(id) - 1]}
        resizeMode="cover"
        className="flex-1"
      >
        <AppGradient colors={["transparent", "rgba(0,0,0,0.8)"]}>
          <Pressable
            onPress={() => router.back()}
            className="absolute top-16 left-6 z-10"
          >
            <AntDesign name="leftcircle" size={50} color="white" />
          </Pressable>
          <View className="flex-1 justify-center">
            <View className="mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center">
              <Text className="text-4xl text-black font-rmono">
                {formattedTimeMinutes}:{formattedTimeSeconds}
              </Text>
            </View>
          </View>
          <View className="mb-5">
            <CustomButton
              onPress={handleAdjustDuration}
              title="Adjust duration"
              containerStyles="mb-5"
            />
            <CustomButton
              onPress={toggleMeditationSessionStatus}
              title={meditating ? 'Stop' : "Start Meditation"}
            />
          </View>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default Meditate;
