import { useColorScheme } from "nativewind";

export function useTheme() {
    const { colorScheme, setColorScheme } = useColorScheme();

    return {
        isDark: colorScheme === "dark",
        toggleTheme: () =>
            setColorScheme(colorScheme === "dark" ? "light" : "dark"),
    };
}