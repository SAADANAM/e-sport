import React, { useEffect, useState } from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';

// Replace this with your ngrok URL (no trailing slash)
const API_URL = 'https://ab47-196-118-210-65.ngrok-free.app';

// Types
interface Tournament {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

interface Team {
  id: number;
  name: string;
  city?: string;
  country?: string;
}

interface Player {
  id: number;
  name: string;
  position?: string;
  jerseyNumber?: string;
}

// Navigation types
type RootStackParamList = {
  Welcome: undefined;
  Tournaments: undefined;
  Teams: { tournament: Tournament };
  Players: { team: Team };
};

type WelcomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Welcome'>;
};

type TournamentsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Tournaments'>;
};

type TeamsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Teams'>;
  route: RouteProp<RootStackParamList, 'Teams'>;
};

type PlayersScreenProps = {
  route: RouteProp<RootStackParamList, 'Players'>;
};

function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <View style={styles.gradientContainer}>
      <SafeAreaView style={styles.centered}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Tournament App</Text>
          <Text style={styles.welcomeSubtitle}>Your Ultimate Sports Companion</Text>
          <TouchableOpacity 
            style={styles.welcomeButton}
            onPress={() => navigation.navigate('Tournaments')}
          >
            <Text style={styles.welcomeButtonText}>Explore Tournaments</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

function TournamentsScreen({ navigation }: TournamentsScreenProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/tournaments`)
      .then(res => res.json())
      .then((data: Tournament[]) => {
        setTournaments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tournaments}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Teams', { tournament: item })}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tournaments found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function TeamsScreen({ route, navigation }: TeamsScreenProps) {
  const { tournament } = route.params;
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/tournaments/${tournament.id}/teams`)
      .then(res => res.json())
      .then((data: Team[]) => {
        setTeams(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tournament.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tournament.name}</Text>
        <Text style={styles.headerSubtitle}>Teams</Text>
      </View>
      <FlatList
        data={teams}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.teamCard}
            onPress={() => navigation.navigate('Players', { team: item })}
          >
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{item.name}</Text>
              <Text style={styles.teamLocation}>{item.city}, {item.country}</Text>
            </View>
            <View style={styles.teamArrow}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No teams found for this tournament</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function PlayersScreen({ route }: PlayersScreenProps) {
  const { team } = route.params;
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/teams/${team.id}/players`)
      .then(res => res.json())
      .then((data: Player[]) => {
        setPlayers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [team.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{team.name}</Text>
        <Text style={styles.headerSubtitle}>Players</Text>
      </View>
      <FlatList
        data={players}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{item.name}</Text>
              <View style={styles.playerDetails}>
                <Text style={styles.playerDetail}>Position: {item.position || 'N/A'}</Text>
                <Text style={styles.playerDetail}>Jersey: {item.jerseyNumber || 'N/A'}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No players found for this team</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a237e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tournaments" component={TournamentsScreen} />
        <Stack.Screen name="Teams" component={TeamsScreen} />
        <Stack.Screen name="Players" component={PlayersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gradientContainer: {
    flex: 1,
    backgroundColor: '#1a237e',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 48,
    textAlign: 'center',
    opacity: 0.8,
  },
  welcomeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  welcomeButtonText: {
    color: '#1a237e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: '#1a237e',
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 16,
  },
  dateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dateText: {
    color: '#ffffff',
    fontSize: 14,
  },
  header: {
    backgroundColor: '#1a237e',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  teamCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  teamLocation: {
    fontSize: 14,
    color: '#666666',
  },
  teamArrow: {
    marginLeft: 16,
  },
  arrowText: {
    fontSize: 24,
    color: '#1a237e',
  },
  playerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  playerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerDetail: {
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
}); 