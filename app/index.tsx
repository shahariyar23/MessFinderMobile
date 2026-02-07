import { Redirect } from 'expo-router';

export default function Index() {
    // Redirect to dashboard (tabs) as the default route
    return <Redirect href="/(tabs)" />;
}
