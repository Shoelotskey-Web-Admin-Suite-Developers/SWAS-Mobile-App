import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface AdditionalDetail {
  label: string;
  price: string;
  duration: string;
}

interface ServicesModalCardProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  imageSource: any;
  price: string;
  days: string;
  description: string;
  additionalDetails?: AdditionalDetail[];
}

const ServicesModalCard: React.FC<ServicesModalCardProps> = ({
  visible,
  onClose,
  title,
  imageSource,
  price,
  days,
  description,
  additionalDetails = [],
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
            <View style={styles.imageOverlay}>
              <ThemedText type="title" style={styles.imageTitle}>{title}</ThemedText>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.row}>
              <View>
                <ThemedText type="titleSmall" style={styles.label}>Price</ThemedText>
                <ThemedText style={styles.text}>{price}</ThemedText>
              </View>
              <View>
                <ThemedText type="titleSmall" style={styles.label}>Days</ThemedText>
                <ThemedText style={styles.text}>{days}</ThemedText>
              </View>
            </View>

            <ThemedText type="titleSmall" style={styles.label}>Description</ThemedText>
            <ThemedText style={styles.text}>{description}</ThemedText>

            {additionalDetails.length > 0 && (
              <>
                <ThemedText type="titleSmall" style={styles.label}>Additional</ThemedText>
                {additionalDetails.map((item, index) => (
                  <View key={index} style={styles.additionalRow}>
                    <ThemedText style={styles.additionalText}>{item.label}</ThemedText>
                    <ThemedText style={styles.additionalText}>
                      {item.price} – {item.duration}
                    </ThemedText>
                  </View>
                ))}
              </>
            )}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText type="button" style={styles.closeText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ServicesModalCard;


const styles = StyleSheet.create({
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 150,
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageTitle: {
        color: '#fff',
        fontSize: 28,
    },
    overlay: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
    },
    content: {
        padding: 16,
        paddingTop: 0,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 8,
        alignSelf: 'center',
    },
    label: {
        fontWeight: 'bold',
        color: 'crimson',
        marginTop: 10,
    },
    text: {
        marginTop: 4,
        color: '#444',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    additionalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    additionalText: {
        fontSize: 14,
        color: '#444',
    },
    closeButton: {
        padding: 12,
        alignItems: 'center',
        backgroundColor: 'crimson',
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    });
