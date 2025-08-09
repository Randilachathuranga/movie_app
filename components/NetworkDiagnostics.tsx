import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { config } from '@/config';

export const NetworkDiagnostics = () => {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testConnectivity = async () => {
    setTesting(true);
    setResults([]);
    
    addResult("🔍 Starting network diagnostics...");
    addResult(`📍 Testing endpoint: ${config.appwrite.endpoint}`);
    addResult(`🔑 Project ID: ${config.appwrite.projectId}`);
    
    // Test 1: Basic fetch to Appwrite Cloud
    try {
      addResult("🌐 Testing basic connectivity...");
      const response = await fetch('https://cloud.appwrite.io/v1/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        addResult("✅ Basic connectivity: SUCCESS");
        const data = await response.text();
        addResult(`📊 Response: ${data.substring(0, 100)}...`);
      } else {
        addResult(`❌ Basic connectivity: FAILED (${response.status})`);
      }
    } catch (error) {
      addResult(`❌ Basic connectivity: ERROR - ${error}`);
    }

    // Test 2: Test with project ID
    try {
      addResult("🔐 Testing with project authentication...");
      const response = await fetch(`${config.appwrite.endpoint}/health`, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': config.appwrite.projectId,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        addResult("✅ Project auth: SUCCESS");
      } else {
        addResult(`❌ Project auth: FAILED (${response.status})`);
      }
    } catch (error) {
      addResult(`❌ Project auth: ERROR - ${error}`);
    }

    // Test 3: Test account endpoint (this is what fails during login)
    try {
      addResult("👤 Testing account endpoint...");
      const response = await fetch(`${config.appwrite.endpoint}/account`, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': config.appwrite.projectId,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        addResult("✅ Account endpoint: SUCCESS (401 expected - not logged in)");
      } else if (response.ok) {
        addResult("✅ Account endpoint: SUCCESS");
      } else {
        addResult(`❌ Account endpoint: FAILED (${response.status})`);
      }
    } catch (error) {
      addResult(`❌ Account endpoint: ERROR - ${error}`);
    }

    // Test 4: Test database connectivity
    try {
      addResult("🗄️ Testing database endpoint...");
      const response = await fetch(`${config.appwrite.endpoint}/databases/${config.appwrite.databaseId}`, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': config.appwrite.projectId,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        addResult("✅ Database endpoint: SUCCESS (401 expected - not logged in)");
      } else if (response.ok) {
        addResult("✅ Database endpoint: SUCCESS");
      } else {
        addResult(`❌ Database endpoint: FAILED (${response.status})`);
      }
    } catch (error) {
      addResult(`❌ Database endpoint: ERROR - ${error}`);
    }

    addResult("🏁 Network diagnostics complete!");
    setTesting(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <View className="p-4 bg-primary">
      <Text className="text-white text-lg font-bold mb-4">Network Diagnostics</Text>
      
      <View className="flex-row gap-2 mb-4">
        <TouchableOpacity
          onPress={testConnectivity}
          disabled={testing}
          className={`bg-light-100 px-4 py-2 rounded-lg flex-1 ${testing ? 'opacity-50' : ''}`}
        >
          <Text className="text-secondary text-center font-semibold">
            {testing ? 'Testing...' : 'Run Tests'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={clearResults}
          className="bg-accent px-4 py-2 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="bg-dark-100 p-3 rounded-lg max-h-96">
        {results.length === 0 ? (
          <Text className="text-light-300 text-center">Tap 'Run Tests' to start diagnostics</Text>
        ) : (
          results.map((result, index) => (
            <Text key={index} className="text-light-200 text-xs mb-1 font-mono">
              {result}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
};
