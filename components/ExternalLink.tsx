import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Linking, Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          
          // Check if the link is a deep link to the app
          if (href.startsWith('expo://') || href.startsWith('exp://') || href.startsWith('localhost://')) {
            // Open the deep link in the app
            Linking.openURL(href);
          } else {
            // Open the external link in an in-app browser.
            await openBrowserAsync(href);
          }
        }
      }}
    />
  );
}
