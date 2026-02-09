import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X, Upload, Trash2 } from 'lucide-react-native';
import { Colors } from '../../constants';
import { Button } from '../../components/ui';
import { HomeSlider } from '../../types';

export default function HomepageManagement() {
    const [sliders, setSliders] = useState<HomeSlider[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSliderUrl, setNewSliderUrl] = useState('');

    const handleAddSlider = async () => {
        if (!newSliderUrl.trim()) {
            Alert.alert('Error', 'Please enter an image URL');
            return;
        }

        try {
            // TODO: Replace with actual API call
            // await adminService.addHomeSlider({ image: newSliderUrl });
            // console.log('Adding slider:', newSliderUrl);
            setNewSliderUrl('');
            setShowAddModal(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to add slider');
        }
    };

    const handleDeleteSlider = async (sliderId: string) => {
        Alert.alert('Delete Slider', 'Are you sure you want to delete this slider?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        // TODO: API call
                        // await adminService.deleteHomeSlider(sliderId);
                        // console.log('Deleting slider:', sliderId);
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete slider');
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <ScrollView className="flex-1">
                {/* Hero Carousel Management */}
                <View className="p-5">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-800">Hero Carousel</Text>
                        <TouchableOpacity
                            onPress={() => setShowAddModal(true)}
                            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
                        >
                            <Plus size={18} color="#fff" />
                            <Text className="text-white font-medium ml-2">Add Slide</Text>
                        </TouchableOpacity>
                    </View>

                    {sliders.length === 0 ? (
                        <View className="bg-white rounded-2xl p-8 items-center">
                            <Upload size={48} color={Colors.gray[300]} />
                            <Text className="text-gray-500 mt-4 text-center">No sliders added yet</Text>
                            <Text className="text-gray-400 text-sm text-center mt-1">
                                Add hero carousel slides to feature on homepage
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-3">
                            {sliders.map((slider, index) => (
                                <View key={slider._id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <Image
                                        source={{ uri: slider.backgroundImage?.url }}
                                        className="w-full h-40"
                                        resizeMode="cover"
                                    />
                                    <View className="p-4 flex-row justify-between items-center">
                                        <Text className="text-gray-700 font-medium">Slide {index + 1}</Text>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteSlider(slider._id)}
                                            className="bg-red-50 p-2 rounded-lg"
                                        >
                                            <Trash2 size={18} color={Colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Platform Stats Configuration */}
                <View className="p-5">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Platform Statistics</Text>
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-gray-500 text-center py-8">
                            Statistics are automatically calculated from platform data
                        </Text>
                    </View>
                </View>

                {/* Featured Messes */}
                <View className="p-5">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Featured Messes</Text>
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-gray-500 text-center py-8">
                            Featured messes are automatically selected based on ratings and bookings
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Add Slider Modal */}
            <Modal visible={showAddModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Add New Slide</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <X size={24} color={Colors.gray[600]} />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-6">
                            <Text className="text-gray-700 font-medium mb-2">Image URL</Text>
                            <TextInput
                                placeholder="https://example.com/image.jpg"
                                value={newSliderUrl}
                                onChangeText={setNewSliderUrl}
                                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                                placeholderTextColor={Colors.gray[400]}
                                autoCapitalize="none"
                            />
                            <Text className="text-gray-400 text-sm mt-2">
                                Enter the URL of the image for the carousel slide
                            </Text>
                        </View>

                        <Button title="Add Slide" onPress={handleAddSlider} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
