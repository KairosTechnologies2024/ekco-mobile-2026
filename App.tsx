import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <ExpoRoot context={require.context('./app')} />
    </Provider>
  );
}

registerRootComponent(App);
