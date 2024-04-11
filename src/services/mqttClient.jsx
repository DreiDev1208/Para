/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import initialize from '../../lib';
import EventEmitter from 'events';
import {URI, PORT, userName, password} from '../utils/key';

// Initialize necessary libraries or configurations
initialize();

// MQTT Client class definition
class MqttClient {
  constructor() {
    this.client = null; // Initialize the client as null
    this.callbacks = {}; // Store topic-specific message callbacks
    this.eventEmitter = new EventEmitter(); // Create an event emitter for custom events
    this.onLocationReceived = null; // Initialize the location received callback
  }

  // Initialize the MQTT client
  initializeClient() {
    const clientId = `Myclient-${Math.floor(Math.random() * 1000000)}`;
    this.client = new Paho.MQTT.Client(URI, PORT, clientId);
    this.client.onMessageArrived = this.onMessageArrived;
    this.client.onConnectionLost = this.onConnectionLost;
  }

  // Callback function when the MQTT client connects
  onConnect = () => {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        this.initializeClient();
      }

      const connectOptions = {
        timeout: 10000,
        onSuccess: () => {
          // Subscribe to the 'gps/location' topic and set a callback to handle incoming messages
          this.onSubscribe('gps/location', (data) => {
            console.log('Received GPS Data:', data);
            const [latitude,longitude] = data.split(',');
            if (this.onLocationReceived) {
              this.onLocationReceived(parseFloat(latitude), parseFloat(longitude));
            }
            // Emit a custom event 'newLocation' with the received data
            this.eventEmitter.emit('newLocation', data);
          });
          resolve();
        },
        useSSL: true,
        onFailure: (errorCode, errorMessage) => {
          console.error('MQTT Connection Failure:', errorCode, errorMessage);
          reject(new Error('MQTT Connection Failed'));
        },
        reconnect: true, // Enable automatic reconnection
        keepAliveInterval: 60,
        cleanSession: true,
        userName: userName,
        password: password,
      };

      this.client.connect(connectOptions);
    });
  };

  // Callback function when a message is received
  onMessageArrived = (message) => {
    const { payloadString, topic } = message;
    console.log('onMessageArrived:', payloadString);
    this.callbacks[topic](payloadString); // Call the appropriate callback for the topic
  };

  // Subscribe to a specific MQTT topic with a callback
  onSubscribe = (topic, callback) => {
    this.callbacks[topic] = callback;
    this.client.subscribe(topic);
  };

  // Callback function when the connection to MQTT is lost
  onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.error('MQTT Connection Lost:', responseObject.errorMessage);
      if (!this.client.connected) {
        this.initializeClient();
        this.onConnect()
          .then(() => {
            console.log('Reconnected to MQTT');
          })
          .catch((error) => {
            console.error('Reconnection failed:', error);
          });
      }
    }
  };

  // Connect to MQTT and initialize the client
  connectAndInitialize = () => {
    return this.onConnect();
  };
}

// Create a singleton instance of the MQTT client
const client = new MqttClient();
export { client as MqttClient };
