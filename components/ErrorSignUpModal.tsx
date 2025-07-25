import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface ErrorModalProps {
  visible: boolean;
  onClose: (event: GestureResponderEvent) => void;
  title?: string;
  message?: string;
  buttonLabel?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  onClose,
  title = 'Error Signing Up',
  message = `The name entered is already used\nby an existing account. Try logging in\nwith the said username\nalong with your corresponding birthdate.`,
  buttonLabel = 'Back',
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ThemedText type="header" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText type="default" style={styles.message}>
            {message}
          </ThemedText>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <ThemedText type="button" style={styles.buttonText}>
              {buttonLabel}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#D11315',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 30,
    color: '#222',
  },
  button: {
    backgroundColor: '#D11315',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
  },
});
