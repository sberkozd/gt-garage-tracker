import LottieView from "lottie-react-native";

export default function SplashScreen() {
    return (
        <LottieView
            source={require("../../assets/carAnimation.json")}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
        />
    );
}
