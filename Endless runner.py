import pygame
import random
import sys
import math

# 1. Initialize Pygame
pygame.init()

# 2. Set up the screen
WIDTH = 800
HEIGHT = 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Endless Roller")
clock = pygame.time.Clock()

# 3. Define Colors
WHITE = (255, 255, 255)
BLUE = (50, 150, 255)   # Ball color
RED = (255, 50, 50)     # Obstacle color
GOLD = (255, 215, 0)    # Pyramid color
BLACK = (0, 0, 0)
BROWN = (139, 69, 19)   # Ground color
GREY = (169, 169, 169)  # Hammer color
PURPLE = (128, 0, 128)  # Spring color
GREEN = (50, 200, 50)   # Active powerup bar

# 4. Game Variables
# Player (Ball)
ball_radius = 20
player_x = 100
player_y = HEIGHT - 50 - ball_radius
player_velocity_y = 0
gravity = 0.8
normal_jump_power = -15
spring_jump_power = -22
is_jumping = False
rotation_angle = 0  # To make the ball look like it's rolling

# Ground
ground_height = 50
ground_y = HEIGHT - ground_height

# Obstacles (Boxes)
obstacles = []
obstacle_speed = 6
obstacle_spawn_timer = 0

# Collectibles (Golden Pyramids)
collectibles = []
collectible_spawn_timer = 0

# Power-ups
powerups = []
powerup_spawn_timer = 0
active_powerup = None  # Can be "hammer" or "spring"
powerup_timer = 0
POWERUP_DURATION = 300 # 5 seconds at 60 FPS

# Game State
score = 0
font = pygame.font.SysFont(None, 48)
small_font = pygame.font.SysFont(None, 36)
game_over = False

def spawn_obstacle():
    """Create a new box obstacle on the right side of the screen."""
    width = random.randint(30, 60)
    height = random.randint(40, 80)
    # The obstacle sits on the ground
    rect = pygame.Rect(WIDTH, ground_y - height, width, height)
    obstacles.append(rect)

def spawn_collectible():
    """Create a new golden pyramid collectible."""
    # Pyramids will be placed randomly in the air or on the ground
    x_pos = WIDTH
    y_pos = random.randint(ground_y - 150, ground_y - 40)
    rect = pygame.Rect(x_pos, y_pos, 30, 30)
    collectibles.append(rect)

def spawn_powerup():
    """Create a new powerup (hammer or spring)."""
    type_ = random.choice(["hammer", "spring"])
    x_pos = WIDTH
    y_pos = random.randint(ground_y - 150, ground_y - 40)
    rect = pygame.Rect(x_pos, y_pos, 30, 30)
    powerups.append({"rect": rect, "type": type_})

def draw_pyramid(surface, color, rect):
    """Draw a triangle (pyramid) inside the given rectangle."""
    # Top point
    p1 = (rect.centerx, rect.top)
    # Bottom left
    p2 = (rect.left, rect.bottom)
    # Bottom right
    p3 = (rect.right, rect.bottom)
    pygame.draw.polygon(surface, color, [p1, p2, p3])

def draw_hammer(surface, rect):
    """Draw a simple hammer shape."""
    # Handle
    handle_rect = pygame.Rect(rect.centerx - 3, rect.centery, 6, rect.height // 2)
    pygame.draw.rect(surface, BROWN, handle_rect)
    # Head
    head_rect = pygame.Rect(rect.left, rect.top + 5, rect.width, 10)
    pygame.draw.rect(surface, GREY, head_rect)
    pygame.draw.rect(surface, BLACK, head_rect, 2)

def draw_spring(surface, rect):
    """Draw a simple spring shape."""
    pygame.draw.rect(surface, PURPLE, rect)
    pygame.draw.rect(surface, BLACK, rect, 2)
    # Zig-zag lines for spring
    p1 = (rect.left, rect.bottom)
    p2 = (rect.right, rect.centery + 5)
    p3 = (rect.left, rect.centery - 5)
    p4 = (rect.right, rect.top)
    pygame.draw.lines(surface, BLACK, False, [p1, p2, p3, p4], 3)

# 5. Main Game Loop
while True:
    # --- Event Handling ---
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
            
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if game_over:
                    # Restart the game if game over
                    game_over = False
                    score = 0
                    obstacle_speed = 6
                    obstacles.clear()
                    collectibles.clear()
                    powerups.clear()
                    active_powerup = None
                    powerup_timer = 0
                    player_y = ground_y - ball_radius
                    player_velocity_y = 0
                elif not is_jumping:
                    # Jump if currently on the ground
                    if active_powerup == "spring":
                        player_velocity_y = spring_jump_power
                    else:
                        player_velocity_y = normal_jump_power
                    is_jumping = True

    if not game_over:
        # --- Game Logic ---
        
        # Powerup Timer
        if active_powerup:
            powerup_timer -= 1
            if powerup_timer <= 0:
                active_powerup = None

        # Apply Gravity
        player_velocity_y += gravity
        player_y += player_velocity_y
        
        # Check collision with ground
        if player_y >= ground_y - ball_radius:
            player_y = ground_y - ball_radius
            player_velocity_y = 0
            is_jumping = False
            
        # Create a Rect for the player to handle collisions easily
        player_rect = pygame.Rect(player_x - ball_radius, player_y - ball_radius, ball_radius * 2, ball_radius * 2)

        # Roll the ball
        rotation_angle = (rotation_angle - obstacle_speed) % 360

        # Spawn Items
        obstacle_spawn_timer += 1
        if obstacle_spawn_timer > random.randint(60, 120): # Random time between spawns
            spawn_obstacle()
            obstacle_spawn_timer = 0
            
        collectible_spawn_timer += 1
        if collectible_spawn_timer > random.randint(80, 150):
            spawn_collectible()
            collectible_spawn_timer = 0

        # Spawn Powerups (rarer than collectibles)
        powerup_spawn_timer += 1
        if powerup_spawn_timer > random.randint(300, 600):
            spawn_powerup()
            powerup_spawn_timer = 0

        # Move and Remove Items
        for obs in obstacles[:]:
            obs.x -= obstacle_speed
            if obs.right < 0:
                obstacles.remove(obs)
                score += 1 # Increase score for dodging an obstacle

        for col in collectibles[:]:
            col.x -= obstacle_speed
            if col.right < 0:
                collectibles.remove(col)

        for p in powerups[:]:
            p["rect"].x -= obstacle_speed
            if p["rect"].right < 0:
                powerups.remove(p)

        # Check Collisions
        # 1. Collision with Obstacles
        for obs in obstacles[:]:
            if player_rect.colliderect(obs):
                if active_powerup == "hammer":
                    # Smash the box!
                    obstacles.remove(obs)
                    score += 5 # Bonus score for smashing
                else:
                    # Game Over
                    game_over = True
                
        # 2. Collision with Collectibles
        for col in collectibles[:]:
            if player_rect.colliderect(col):
                score += 10 # 10 points for a pyramid
                collectibles.remove(col)

        # 3. Collision with Powerups
        for p in powerups[:]:
            if player_rect.colliderect(p["rect"]):
                active_powerup = p["type"]
                powerup_timer = POWERUP_DURATION
                powerups.remove(p)
                
        # Gradually increase game speed to make it harder over time
        current_speed = 6 + (score // 50)
        # Cap speed so it doesn't become impossible
        if current_speed > 15:
            current_speed = 15
        obstacle_speed = current_speed

    # --- Drawing ---
    screen.fill(WHITE) # Clear screen with white background
    
    # Draw Ground
    pygame.draw.rect(screen, BROWN, (0, ground_y, WIDTH, ground_height))
    
    # Draw Obstacles (Boxes)
    for obs in obstacles:
        pygame.draw.rect(screen, RED, obs)
        pygame.draw.rect(screen, BLACK, obs, 2)
        
    # Draw Collectibles (Pyramids)
    for col in collectibles:
        draw_pyramid(screen, GOLD, col)
        pygame.draw.polygon(screen, BLACK, [(col.centerx, col.top), (col.left, col.bottom), (col.right, col.bottom)], 2)
        
    # Draw Powerups
    for p in powerups:
        if p["type"] == "hammer":
            draw_hammer(screen, p["rect"])
        elif p["type"] == "spring":
            draw_spring(screen, p["rect"])

    # Draw Player (Ball)
    # Change ball color slightly if powerup is active
    ball_color = BLUE
    if active_powerup == "hammer":
        ball_color = GREY
    elif active_powerup == "spring":
        ball_color = PURPLE

    pygame.draw.circle(screen, ball_color, (int(player_x), int(player_y)), ball_radius)
    pygame.draw.circle(screen, BLACK, (int(player_x), int(player_y)), ball_radius, 2)
    
    # Draw a line inside the ball to show rolling
    line_x = player_x + ball_radius * math.cos(math.radians(rotation_angle))
    line_y = player_y + ball_radius * math.sin(math.radians(rotation_angle))
    pygame.draw.line(screen, BLACK, (player_x, player_y), (line_x, line_y), 3)
    
    # Draw Score
    score_text = font.render(f"Score: {score}", True, BLACK)
    screen.blit(score_text, (10, 10))

    # Draw Active Powerup Status
    if active_powerup:
        status_text = small_font.render(f"Powerup: {active_powerup.upper()}", True, GREEN)
        screen.blit(status_text, (10, 50))
        # Draw a little timer bar
        timer_width = (powerup_timer / POWERUP_DURATION) * 200
        pygame.draw.rect(screen, GREEN, (10, 80, timer_width, 10))
        pygame.draw.rect(screen, BLACK, (10, 80, 200, 10), 2)
    
    if game_over:
        # Display Game Over text
        game_over_text = font.render("GAME OVER", True, RED)
        restart_text = font.render("Press SPACE to Restart", True, BLACK)
        
        screen.blit(game_over_text, game_over_text.get_rect(center=(WIDTH/2, HEIGHT/2 - 25)))
        screen.blit(restart_text, restart_text.get_rect(center=(WIDTH/2, HEIGHT/2 + 25)))

    # Update Display
    pygame.display.flip()
    
    # Frame Rate (60 FPS)
    clock.tick(60)
