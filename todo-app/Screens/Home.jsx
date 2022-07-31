import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import Task from '../Components/Task';
import Icon from 'react-native-vector-icons/Entypo';
import { Dialog, Button } from 'react-native-paper';

const Home = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const hideDialog = () => {
        setOpenDialog(!openDialog);
    };

    const addTaskHandler = () => {
        console.log('Kuch toh hua h...');
    };

    const tasks = [
        {
            title: 'Task 1',
            description: 'Sample Task 1',
            status: false,
            _id: 'vav556sv5s6v456svb5s6v26',
        },
        {
            title: 'Task 2',
            description: 'Sample Task 2',
            status: true,
            _id: 'vav556sv5s6v456svb5s6v56',
        },
    ];
    return (
        <>
            <View
                style={{
                    backgroundColor: '#fff',
                    flex: 1,
                    paddingTop:
                        Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                }}
            >
                <ScrollView>
                    <SafeAreaView>
                        <Text style={styles.heading}>All Tasks</Text>
                        {tasks.map((item) => (
                            <Task
                                key={item._id}
                                title={item.title}
                                description={item.description}
                                status={item.status}
                                taskId={item.taskId}
                            />
                        ))}
                        <TouchableOpacity style={styles.addBtn} onPress={hideDialog}>
                            <Icon name="add-to-list" size={20} color="#900" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </ScrollView>
            </View>
            <Dialog visible={openDialog} onDismiss={hideDialog}>
                <Dialog.Title>ADD A TASK</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <TouchableOpacity onPress={hideDialog}>
                            <Text>CANCEL</Text>
                        </TouchableOpacity>
                        <Button
                            onPress={addTaskHandler}
                            color="#900"
                            disabled={!title || !description}
                        >
                            ADD
                        </Button>
                    </View>
                </Dialog.Content>
            </Dialog>
        </>
    );
};

export default Home;

const styles = StyleSheet.create({
    heading: {
        fontSize: 28,
        textAlign: 'center',
        marginTop: 25,
        marginBottom: 20,
        color: '#fff',
        backgroundColor: '#474747',
    },
    addBtn: {
        backgroundColor: '#fff',
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'center',
        marginVertical: 20,
        elevation: 7,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#b5b5b5',
        padding: 10,
        paddingLeft: 15,
        borderRadius: 5,
        marginVertical: 15,
        fontSize: 15,
    },
});
