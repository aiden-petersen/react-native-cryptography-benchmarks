/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}
import React, {useState} from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';

import {ecdsaJavascript} from './ecdsaJavascript';
import {ecdsaCpp} from './ecdsaCpp';
import {ecdsaSwift} from './ecdsaSwift';
import {genSignature} from './generateSignature';

type BenchmarkResult = {env: string; averageVerifyTime: number};

const App = () => {
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult[]>();
  const numIterations = 30;
  const messageSize = 4096;

  const onPressRunBenchmark = () => {
    const testVectors = [...Array(numIterations).keys()].map(() => {
      return genSignature(messageSize);
    });

    void [
      {env: 'Cpp', verify: ecdsaCpp.verify},
      {env: 'Javascript', verify: ecdsaJavascript.verify},
      {env: 'Swift', verify: ecdsaSwift.verify},
    ].forEach(({env, verify}) => {
      var totalRunTime = 0;
      testVectors.map(signatureDetails => {
        // @ts-ignore
        const startDate = global.nativePerformanceNow();
        const verified = verify(signatureDetails);
        // @ts-ignore
        const finishDate = global.nativePerformanceNow();
        if (!verified) {
          throw "shouldn't get here, verification failed";
        }
        totalRunTime += finishDate - startDate;
      });
      setBenchmarkResult(prevValue => [
        ...(prevValue ?? []),
        {env, averageVerifyTime: totalRunTime / testVectors.length},
      ]);
    });
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <Button title={'run benchmark'} onPress={onPressRunBenchmark} />
      <Text>Average verify time:</Text>
      <View style={{padding: 20}}>
        {benchmarkResult &&
          benchmarkResult.map(result => {
            return (
              <Text
                key={
                  result.averageVerifyTime
                }>{`${result.env}: ${result.averageVerifyTime} ms`}</Text>
            );
          })}
      </View>
    </SafeAreaView>
  );
};

export default App;
