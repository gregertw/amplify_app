import React from 'react';
import { Linking, Button, StyleSheet, Text, View, Platform } from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';

import awsconfig from './aws-exports';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export default withAuthenticator(class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleAnalyticsClick = this.handleAnalyticsClick.bind(this);
        this.state = {resultHtml: <Text></Text>, eventsSent: 0};
    }

  handleAnalyticsClick() {
    Analytics.record('AWS Amplify Tutorial Event')
        .then( (evt) => {
            const url = 'https://'+awsconfig.aws_project_region+'.console.aws.amazon.com/pinpoint/home/?region='+awsconfig.aws_project_region+'#/apps/'+awsconfig.aws_mobile_analytics_app_id+'/analytics/events';
            let result = (
                  <View>
                    <Text>Event Submitted.</Text>
                    <Text>Events sent: {++this.state.eventsSent}</Text>
                    <Text style={styles.link} onPress={() => Linking.openURL(url)}>
                      View Events on the Amazon Pinpoint Console
                    </Text>
                  </View>
            );
            this.setState({
                'resultHtml': result
            });
        });
  };

    render() {
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to your React Native App with Amplify!</Text>
            <Text style={styles.instructions}>To get started, edit App.js</Text>
            <Text style={styles.instructions}>{instructions}</Text>
          <Button title="Generate Analytics Event" onPress={this.handleAnalyticsClick} />
          {this.state.resultHtml}
        </View>
    );
  }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    link: {
    color: 'blue'
  }
});
