import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EduPrime Login',
      home: LoginScreen(),
    );
  }
}

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String? _token;
  String? _username;
  bool _loading = false;

  Future<void> _login() async {
    setState(() {
      _loading = true;
    });

    final url = Uri.parse('https://automation.vnrvjiet.ac.in/eduprime3sandbox/api/Auth/Validate');
    final headers = {'APIKey': '1234567890', 'Content-Type': 'application/json'};
    final body = jsonEncode({
      'username': _usernameController.text,
      'password': _passwordController.text,
    });

    try {
      final response = await http.post(url, headers: headers, body: body);
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['Status'] == 1) {
        setState(() {
          _token = data['Data'];
          _username = _usernameController.text;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed: ${data['Data']}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error123: $e')),
      );
    }

    setState(() {
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _token == null
          ? Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextField(
                    controller: _usernameController,
                    decoration: InputDecoration(labelText: 'Username'),
                  ),
                  TextField(
                    controller: _passwordController,
                    decoration: InputDecoration(labelText: 'Password'),
                    obscureText: true,
                  ),
                  SizedBox(height: 20),
                  _loading
                      ? CircularProgressIndicator()
                      : ElevatedButton(
                          onPressed: _login,
                          child: Text('Login'),
                        ),
                ],
              ),
            )
          : Center(
              child: Text(
                'Hello, $_username!',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
            ),
    );
  }
}
