// src/components/ConfirmModal.tsx
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onConfirm,
  onCancel,
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

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.button, { backgroundColor: '#888' }]}
            >
              <ThemedText type="button" style={styles.buttonText}>
                {cancelLabel}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.button, { backgroundColor: '#D11315' }]}
            >
              <ThemedText type="button" style={styles.buttonText}>
                {confirmLabel}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
