#include "moonlight.hpp"

void moonlight::paybyowner(name username)
{
    require_auth(_self);
    profile_tab prof(_self, _self.value);
    auto itr = prof.find(username.value);
    if (itr == prof.end())
    {
        prof.emplace(_self, [&](auto &e) {
            e.username = username;
            e.lastlogin = current_time_point();
        });
    }
    else
    {
        prof.modify(itr, _self, [&](auto &row) {
            row.lastlogin = current_time_point();
        });
    }
     
}

void moonlight::paybyuser(name username)

{
    require_auth(username);
    profile_tab prof(_self, _self.value);

    auto itr = prof.find(username.value);
    if (itr == prof.end())
    {
        prof.emplace(_self, [&](auto &e) {
            e.username = username;
            e.lastlogin = current_time_point();
        });
    }
    else
    {
        prof.modify(itr, _self, [&](auto &row) {
            row.lastlogin = current_time_point();
        });
    }
}

EOSIO_DISPATCH(moonlight, (paybyowner)(paybyuser))
