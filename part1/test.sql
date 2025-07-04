USE DogWalkService;

INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456','walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('davewalker', 'dave@example.com', 'hashed987', 'walker'),
('eve123', 'eve@example.com', 'hashed654', 'owner');

INSERT INTO Dogs (owner_id, name, size)
VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'eve123'), 'Tahsin', 'small'),
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Molly', 'large'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Roffa', 'large');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella' AND owner_id = (SELECT user_id FROM Users WHERE username = 'carol123')) , '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'Tahsin' AND owner_id = (SELECT user_id FROM Users WHERE username = 'eve123')), '2025-06-10 10:00:00', 30, 'South Chayabithi Road', 'cancelled'),
((SELECT dog_id FROM Dogs WHERE name = 'Molly' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')), '2025-06-10 11:00:00', 50, 'Hellet Cove', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Roffa' AND owner_id = (SELECT user_id FROM Users WHERE username = 'carol123')), '2025-06-09 11:30:00', 40, 'Glenelg', 'completed');