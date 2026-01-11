from django.contrib import admin
from .models import UserProfile, GameSession, Leaderboard, Achievement, Friendship

import openpyxl
from django.http import HttpResponse

admin.site.register(UserProfile)
admin.site.register(Leaderboard)
admin.site.register(Achievement)
admin.site.register(Friendship)



class GameSessionAdmin(admin.ModelAdmin):
    actions = ['export_to_xlsx']

    def export_to_xlsx(self, request, queryset):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(['User', 'Score', 'Level', 'Time Played', 'Completed', 'Created At'])
        for session in queryset:
            created_at_naive = session.created_at.replace(tzinfo=None) if session.created_at else ''  # Убираем tzinfo
            ws.append([
                session.user.username,
                session.score,
                session.level,
                str(session.time_played),
                session.is_completed,
                str(created_at_naive)
            ])
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=sessions.xlsx'
        wb.save(response)
        return response

    export_to_xlsx.short_description = "Export selected to XLSX"

admin.site.register(GameSession, GameSessionAdmin)

class AchievementAdmin(admin.ModelAdmin):
    actions = ['assign_achievement']

    def assign_achievement(self, request, queryset):
        user_id = request.POST.get('user_id')
